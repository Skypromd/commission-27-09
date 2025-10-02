from datetime import timedelta
from django.db.models import Sum, Avg, Count, DecimalField
from django.db.models.functions import TruncMonth, Coalesce
from django.utils import timezone

from backend.apps.commission.models import Commission
from backend.apps.policies.models import Policy


class BIMetricService:
    """
    Серв��с для расчета агрегированных метрик для BI-систем.
    """
    @staticmethod
    def _get_date_range(period):
        """
        Возвращает начальную и конечную дату на основе заданного периода.
        """
        today = timezone.now().date()
        if period == 'day':
            return today, today + timedelta(days=1)
        if period == 'week':
            start_of_week = today - timedelta(days=today.weekday())
            return start_of_week, start_of_week + timedelta(days=7)
        if period == 'month':
            return today.replace(day=1), today
        # ... (можно добавить другие периоды)
        return None, None

    @staticmethod
    def _apply_common_filters(request, queryset):
        """
        Применяет общие фильтры (например, по периоду) к queryset.
        """
        period = request.query_params.get('period')
        start_date, end_date = BIMetricService._get_date_range(period)
        if start_date:
            # Используем date_received из модели Commission
            queryset = queryset.filter(date_received__range=(start_date, end_date))
        return queryset

    @staticmethod
    def get_monthly_commission_volume(request):
        """
        Возвращает сумму комиссий, сгруппированную по месяцам.
        """
        queryset = BIMetricService._apply_common_filters(request, Commission.objects.all())

        return (
            queryset
            .annotate(month=TruncMonth('date_received'))
            .values('month')
            .annotate(total_commission=Sum('gross_commission'))
            .values('month', 'total_commission')
            .order_by('month')
        )

    @staticmethod
    def get_commission_by_provider(request):
        """
        Возвращает сумму комиссий, сгруппированную по страховым компаниям (provider).
        """
        queryset = BIMetricService._apply_common_filters(request, Commission.objects.all())

        return (
            queryset
            .values('policy__provider')
            .annotate(total_commission=Sum('gross_commission'))
            .values('policy__provider', 'total_commission')
            .order_by('-total_commission')
        )

    @staticmethod
    def get_top_performers(request):
        """
        Возвращает рейтинг консультантов по сумме комиссий.
        """
        queryset = BIMetricService._apply_common_filters(request, Commission.objects.all())
        limit = int(request.query_params.get('limit', 10))

        return (
            queryset
            .values('adviser__user__username')
            .annotate(total_commission=Sum('gross_commission'))
            .values('adviser__user__username', 'total_commission')
            .order_by('-total_commission')[:limit]
        )

# --- Функции ниже являются дубликатами логики из api_views и м��гут быть удалены ---
# --- или адаптированы для использования внутри BI сервиса. ---

def get_financial_summary(user):
    """
    Возвращает финансовую сводку для указанного пользователя.
    """
    from backend.apps.commission.api_views import get_commissions_for_user
    commissions = get_commissions_for_user(user)

    summary = commissions.aggregate(
        total_gross_commission=Sum('gross_commission'),
        total_net_commission=Sum('net_commission'),
        total_adviser_fee=Sum('adviser_fee_amount'),
        average_net_commission=Avg('net_commission'),
        commission_count=Count('id')
    )
    return summary
