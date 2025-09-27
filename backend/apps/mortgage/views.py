from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action

from .models import (
    Lender, MortgageCase, Commission, BrokerFee,
    MortgageRetention, MortgageClawback, MortgageBonus, MortgageOverride, MortgageReferralFee,
    MortgageIngestionTask
)
from .serializers import (
    LenderSerializer, MortgageCaseListSerializer, MortgageCaseDetailSerializer,
    CommissionSerializer, BrokerFeeSerializer, MortgageRetentionSerializer,
    MortgageClawbackSerializer, MortgageBonusSerializer, MortgageOverrideSerializer,
    MortgageReferralFeeSerializer, MortgageCommissionDataIngestionSerializer,
    MortgageIngestionTaskSerializer
)
from .filters import MortgageCaseFilter, CommissionFilter
from backend.apps.core.permissions import IsOwnerOrManager, HasReportAccess, IsAdminOrReadOnly
from backend.apps.core.views import (
    BaseReportingViewSet, BaseDashboardViewSet, BaseRelatedObjectViewSet,
    BaseModifierViewSet, BaseDataIngestionViewSet
)
from backend.apps.core.mixins import AdviserObjectOwnerMixin, HierarchicalQuerySetMixin
from .tasks import process_mortgage_commission_ingestion
from . import reports


@extend_schema(tags=['Mortgage'])
class LenderViewSet(viewsets.ModelViewSet):
    """API эндпоинт для управления кредиторами."""
    queryset = Lender.objects.all()
    serializer_class = LenderSerializer
    permission_classes = [IsAdminOrReadOnly]

@extend_schema(tags=['Mortgage'])
class MortgageCaseViewSet(HierarchicalQuerySetMixin, AdviserObjectOwnerMixin, viewsets.ModelViewSet):
    """
    API эндпоинт для ипотечных случаев.
    Применяет иерархическую фильтрацию и автоматическое назначение владельца.
    """
    queryset = MortgageCase.objects.select_related('lender', 'adviser__user', 'client').all().order_by("-created_at")
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend]
    filterset_class = MortgageCaseFilter
    related_field_path = 'adviser'

    def get_serializer_class(self):
        if self.action == 'list':
            return MortgageCaseListSerializer
        return MortgageCaseDetailSerializer

@extend_schema(tags=['Mortgage'])
class CommissionViewSet(BaseRelatedObjectViewSet):
    queryset = Commission.objects.select_related(
        'mortgage_case__adviser'
    ).prefetch_related(
        'mortgageretention_set', 'mortgageclawback_set', 'mortgagebonus_set',
        'mortgageoverride_set', 'mortgagereferralfee_set'
    ).all()
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CommissionFilter
    related_field_path = 'mortgage_case__adviser'

@extend_schema(tags=['Mortgage'])
class BrokerFeeViewSet(BaseRelatedObjectViewSet):
    queryset = BrokerFee.objects.select_related('mortgage_case__adviser').all()
    serializer_class = BrokerFeeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    related_field_path = 'mortgage_case__adviser'

@extend_schema(tags=['Mortgage'])
class BaseMortgageModifierViewSet(BaseModifierViewSet):
    """Базовый ViewSet для всех модификаторов ипотечной комиссии."""
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    related_field_path = 'commission__mortgage_case__adviser'

@extend_schema(tags=['Mortgage'])
class MortgageRetentionViewSet(BaseMortgageModifierViewSet):
    queryset = MortgageRetention.objects.all()
    serializer_class = MortgageRetentionSerializer

@extend_schema(tags=['Mortgage'])
class MortgageClawbackViewSet(BaseMortgageModifierViewSet):
    queryset = MortgageClawback.objects.all()
    serializer_class = MortgageClawbackSerializer

@extend_schema(tags=['Mortgage'])
class MortgageBonusViewSet(BaseMortgageModifierViewSet):
    queryset = MortgageBonus.objects.all()
    serializer_class = MortgageBonusSerializer

@extend_schema(tags=['Mortgage'])
class MortgageOverrideViewSet(BaseMortgageModifierViewSet):
    queryset = MortgageOverride.objects.all()
    serializer_class = MortgageOverrideSerializer

@extend_schema(tags=['Mortgage'])
class MortgageReferralFeeViewSet(BaseMortgageModifierViewSet):
    queryset = MortgageReferralFee.objects.all()
    serializer_class = MortgageReferralFeeSerializer

@extend_schema(tags=['Mortgage Reports'])
class ReportingViewSet(HierarchicalQuerySetMixin, BaseReportingViewSet):
    """ViewSet для аналитических отчетов по ипотеке."""
    permission_classes = [permissions.IsAuthenticated, HasReportAccess]
    queryset = MortgageCase.objects.all()
    related_field_path = 'adviser'

    class Meta:
        date_field = 'completion_date' # Указываем поле для фильтра по дате

    @extend_schema(
        summary="[Ипотека] Отчет по производительности консультантов",
        description="Возвращает количество сделок, общую сумму кредитов и комиссий для консультантов. Учитывает иерархию. Поддерживает фильтрацию по дате завершения (`?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`)."
    )
    @action(detail=False, methods=['get'], url_path='adviser-performance')
    def adviser_performance(self, request):
        """Отчет по производительности консультантов."""
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        report_data = reports.get_adviser_performance_report(queryset)
        return Response(report_data)

    @extend_schema(
        summary="[Ипотека] Отчет по эффективности кредиторов",
        description="Возвращает количество сделок, общую сумму кредитов и комиссий в разрезе по каждому кредитору. Доступно только администраторам. Поддерживает фильтрацию по дате завершения."
    )
    @action(detail=False, methods=['get'], url_path='lender-performance')
    def lender_performance(self, request):
        """Отчет по эффективности кредиторов (только для админов)."""
        start_date, end_date = self.get_date_range()
        data = reports.get_lender_performance_report(start_date, end_date)
        return Response(data)


@extend_schema(tags=['Mortgage'])
class DashboardViewSet(HierarchicalQuerySetMixin, BaseDashboardViewSet):
    """Возвращает агрегированные данные для персонального дашборда по ипотеке."""
    queryset = MortgageCase.objects.all()
    related_field_path = 'adviser'

    def get_dashboard_data(self, queryset):
        """Реализует логик�� сбора данных для дашборда ипотеки."""
        completed_cases = queryset.filter(status=MortgageCase.Status.COMPLETED)
        stats = {
            'in_progress_cases_count': queryset.filter(status=MortgageCase.Status.IN_PROGRESS).count(),
            'completed_cases_count': completed_cases.count(),
            'total_loan_amount': completed_cases.aggregate(total=Sum('loan_amount'))['total'] or 0,
            'total_gross_commission': completed_cases.aggregate(total=Sum('commission__gross_commission'))['total'] or 0,
        }
        return stats

@extend_schema(tags=['Mortgage'])
class IngestionViewSet(BaseDataIngestionViewSet):
    """ViewSet для обработки и отслеживания задач по импорту ипотечных данных."""
    queryset = MortgageIngestionTask.objects.all()
    serializer_class = MortgageIngestionTaskSerializer
    ingestion_serializer_class = MortgageCommissionDataIngestionSerializer
    task_function = process_mortgage_commission_ingestion
