import hashlib
import json
from decimal import Decimal
from django.core.cache import cache
from django.db.models import Sum, F, DecimalField, Avg, ExpressionWrapper, fields, Count
from django.db.models.functions import Coalesce

from apps.mortgage.models import Commission, MortgageCase
from apps.users.models import User
from .filters import CommissionFilter
from .models import Report


class BaseReportService:
    """
    Базовый сервис для отчетов, определяющий общий интерфейс.
    """
    def __init__(self, request):
        self.request = request
        self.user = request.user
        self.query_params = request.query_params

    def get_base_querysets(self):
        """
        Возвращает базовые QuerySets, отфильтрованные по роли пользователя.
        """
        user = self.user
        commission_qs = Commission.objects.all()
        case_qs = MortgageCase.objects.all()

        if user.is_manager:
            subordinates = user.get_descendants(include_self=True)
            commission_qs = commission_qs.filter(mortgage_case__adviser__in=subordinates)
            case_qs = case_qs.filter(adviser__in=subordinates)
        elif user.role == User.Role.ADVISER:
            commission_qs = commission_qs.filter(mortgage_case__adviser=user)
            case_qs = case_qs.filter(adviser=user)
        elif not user.is_superuser:
            return Commission.objects.none(), MortgageCase.objects.none()

        return commission_qs, case_qs

    def _apply_date_filters(self, queryset, date_field_name):
        """
        Применяет фильтры по дате к заданному queryset.
        """
        start_date = self.query_params.get('start_date')
        end_date = self.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(**{f'{date_field_name}__gte': start_date})
        if end_date:
            queryset = queryset.filter(**{f'{date_field_name}__lte': end_date})
        return queryset

    def generate_report(self):
        raise NotImplementedError("Subclasses must implement this method.")


class DetailedReportService(BaseReportService):
    """
    Сервис для генерации детализированного отчета по комиссиям.
    """
    def get_queryset(self):
        commission_qs, _ = self.get_base_querysets()

        filtered_commissions = CommissionFilter(self.query_params, queryset=commission_qs).qs

        return filtered_commissions.select_related(
            'mortgage_case__client',
            'mortgage_case__adviser',
            'mortgage_case__lender',
        ).prefetch_related(
            'modifiers'
        ).order_by('-mortgage_case__created_at')

    def generate_report(self):
        # Для этого сервиса основной метод - get_queryset,
        # generate_report может быть использован для возврата сериализованных данных,
        # но в данном контексте задачи Celery мы будем работать с queryset.
        # Для консистентности вернем пустой словарь.
        return {}


class PerformanceReportService(BaseReportService):
    """
    Сервис для генерации отчета по производительности.
    """
    def generate_report(self):
        _, case_qs = self.get_base_querysets()

        # Применяем фильтры по дате
        case_qs = self._apply_date_filters(case_qs, 'created_at')

        performance_data = case_qs.values('adviser__username').annotate(
            total_cases=Count('id'),
            closed_cases=Count('id', filter=F('status') == MortgageCase.Status.COMPLETED),
            total_commission=Coalesce(Sum('commission__gross_commission'), 0, output_field=DecimalField()),
            avg_closing_time_days=Avg(
                ExpressionWrapper(F('completion_date') - F('created_at'), output_field=fields.DurationField())
            )
        ).order_by('-total_commission')

        # Конвертируем timedelta в дни
        for item in performance_data:
            if item['avg_closing_time_days']:
                item['avg_closing_time_days'] = item['avg_closing_time_days'].days

        return list(performance_data)


class FinancialReportService(BaseReportService):
    """
    Сервис для инкапсуляции логики генерации финансовых отчетов.
    """
    def generate_report(self):
        """
        Генерирует полный финансовый отчет.
        """
        commission_qs, case_qs = self.get_base_querysets()

        # Применяем фильтры
        commission_qs = self._apply_date_filters(commission_qs, 'mortgage_case__created_at')
        case_qs = self._apply_date_filters(case_qs, 'created_at')

        # 1. Расчет заработанных комиссий (только для завершенных дел)
        earned_agg = commission_qs.filter(mortgage_case__status=MortgageCase.Status.COMPLETED).aggregate(
            total_gross_commission=Coalesce(Sum('gross_commission'), 0, output_field=DecimalField()),
            total_net_commission=Coalesce(Sum('net_commission'), 0, output_field=DecimalField()),
        )

        # 2. Расчет прогнозируемого дохода
        projected_agg = case_qs.filter(status__in=[MortgageCase.Status.IN_PROGRESS, MortgageCase.Status.APPROVED]).aggregate(
            projected_total=Coalesce(
                Sum('commission__forecasted_commission'),
                0,
                output_field=DecimalField()
            )
        )

        # 3. Формирование отчета
        return {
            'period': {
                'start_date': self.query_params.get('start_date'),
                'end_date': self.query_params.get('end_date'),
            },
            'earned_commission': {
                'gross_commission_total': earned_agg['total_gross_commission'],
                'net_commission_total': earned_agg['total_net_commission'],
            },
            'projected_income': projected_agg['projected_total'],
        }


class ReportServiceFactory:
    """
    Фабрика для создания экземпляров сервисов отчетов.
    """
    @staticmethod
    def get_service(report_type, request):
        if report_type == Report.ReportType.FORECAST:
            return FinancialReportService(request)
        if report_type == Report.ReportType.COMMISSION_SUMMARY:
            return DetailedReportService(request)
        if report_type == Report.ReportType.PERFORMANCE_ANALYSIS:
            return PerformanceReportService(request)
        # Добавить другие типы отчетов здесь
        # elif report_type == ...:
        #     return ...
        else:
            # По умолчанию ��спользуем финансовый отчет
            return FinancialReportService(request)
