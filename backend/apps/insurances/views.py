from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema
from django.db.models import Count, Sum, Q, F
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import action

from backend.apps.core.models import Client
from backend.apps.core.serializers import ClientComplianceSerializer
from .models import (
    Commission, Policy, Insurer, Retention, Clawback, Bonus, Override, ReferralFee, InsuranceIngestionTask, InsuranceType
)
from .serializers import (
    PolicyListSerializer, PolicyDetailSerializer, PolicyWriteSerializer, InsurerSerializer, CommissionSerializer,
    RetentionSerializer, ClawbackSerializer, BonusSerializer, OverrideSerializer, ReferralFeeSerializer,
    InsuranceCommissionDataIngestionSerializer, InsuranceIngestionTaskSerializer, InsuranceTypeSerializer
)
from backend.apps.core.permissions import IsAdminOrReadOnly, IsOwnerOrManager, HasReportAccess
from .filters import PolicyFilter
from .tasks import process_insurance_commission_ingestion
from backend.apps.core.views import BaseModifierViewSet, BaseRelatedObjectViewSet, BaseDashboardViewSet, BaseReportingViewSet, BaseDataIngestionViewSet
from backend.apps.core.mixins import HierarchicalQuerySetMixin, AdviserObjectOwnerMixin


class ReportingViewSet(HierarchicalQuerySetMixin, BaseReportingViewSet):
    """ViewSet для аналитических отчетов по страхованию."""
    permission_classes = [permissions.IsAuthenticated, HasReportAccess]
    queryset = Policy.objects.all() # Базовый queryset для иерархической фильтрации
    related_field_path = 'adviser' # Путь для фильтрации по иерархии

    class Meta:
        date_field = 'start_date' # Указываем поле для фильтра по дате

    @extend_schema(summary="Отчет по эффективности консультантов")
    @action(detail=False, methods=['get'])
    def adviser_performance(self, request):
        """
        Агрегирует данные по количеству полисов, APV и валовой комиссии для каждого консультанта.
        Автоматически фильтруется по иерархии (менеджер видит своих подчиненных).
        """
        # Используем get_queryset() из миксина для получения отфильтрованных данных
        queryset = self.get_queryset()

        report = queryset.values(
            adviser_name=F('adviser__user__get_full_name')
        ).annotate(
            policy_count=Count('id'),
            total_apv=Sum('annual_premium_value'),
            total_gross_commission=Sum('commission__gross_commission'),
            avg_commission_per_policy=F('total_gross_commission') / F('policy_count')
        ).order_by('-total_gross_commission')

        return Response(report)

    @extend_schema(summary="Финансовая сводка по комиссиям")
    @action(detail=False, methods=['get'])
    def financial_summary(self, request):
        """
        Агрегирует финансовые показатели: валовые/чистые комиссии, удержания, возвраты.
        Доступно только для ролей ADMIN и FINANCE. Фильтруется по иерархии.
        """
        start_date, end_date = self.get_date_range()

        # Получаем полисы, к которым пользователь имеет доступ
        accessible_policies = self.get_queryset()

        commissions = Commission.objects.filter(policy__in=accessible_policies)

        if start_date:
            commissions = commissions.filter(date_received__gte=start_date)
        if end_date:
            commissions = commissions.filter(date_received__lte=end_date)

        summary = commissions.aggregate(
            total_gross=Sum('gross_commission'),
            total_net=Sum('net_commission'),
            total_retention=Sum('retention_set__amount'),
            total_clawback=Sum('clawback_set__amount'),
            total_bonus=Sum('bonus_set__amount')
        )
        return Response(summary)

    @extend_schema(summary="Отчет по комплаенс-статусу клиентов")
    @action(detail=False, methods=['get'])
    def client_compliance_status(self, request):
        """
        Возвращает список клиентов с их комплаенс-статусами (GDPR, жалобы).
        Доступно только для ролей ADMIN и COMPLIANCE. Фильтруется по иерархии.
        """
        # Получаем полисы, к которым пользователь имеет доступ
        accessible_policies = self.get_queryset()
        # Получаем уникальных клиентов из этих полисов
        client_ids = accessible_policies.values_list('client_id', flat=True).distinct()
        queryset = Client.objects.filter(id__in=client_ids).order_by('name')

        serializer = ClientComplianceSerializer(queryset, many=True)
        return Response(serializer.data)


class DashboardViewSet(BaseDashboardViewSet):
    """Возвращает агрегированные данные для персонального дашборда по страхованию."""
    queryset = Policy.objects.all()
    related_field_path = 'adviser'

    def get_dashboard_data(self, queryset):
        """Реализует логику сбора данных для дашборда страхования."""
        thirty_days_from_now = timezone.now().date() + timedelta(days=30)

        stats = {
            'active_policies_count': queryset.filter(status=Policy.PolicyStatus.ACTIVE).count(),
            'total_apv': queryset.filter(status=Policy.PolicyStatus.ACTIVE).aggregate(total=Sum('annual_premium_value'))['total'] or 0,
            'upcoming_renewals_count': queryset.filter(
                status=Policy.PolicyStatus.ACTIVE,
                renewal_date__gte=timezone.now().date(),
                renewal_date__lte=thirty_days_from_now
            ).count(),
            'in_review_policies_count': queryset.filter(status=Policy.PolicyStatus.IN_REVIEW).count(),
        }
        return stats

class InsurerViewSet(viewsets.ModelViewSet):
    """API endpoint for insurers."""
    queryset = Insurer.objects.all()
    serializer_class = InsurerSerializer
    permission_classes = [IsAdminOrReadOnly]

class InsuranceTypeViewSet(viewsets.ModelViewSet):
    """API endpoint for insurance types."""
    queryset = InsuranceType.objects.all()
    serializer_class = InsuranceTypeSerializer
    permission_classes = [IsAdminOrReadOnly]

class PolicyViewSet(HierarchicalQuerySetMixin, AdviserObjectOwnerMixin, viewsets.ModelViewSet):
    """API endpoint for insurance policies with hierarchical permissions."""
    queryset = Policy.objects.select_related(
        'insurer', 'adviser__user', 'client', 'insurance_type', 'commission'
    ).prefetch_related('commission__retention_set', 'commission__clawback_set').all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PolicyFilter
    search_fields = ['policy_number', 'client__name', 'insurer__name']
    ordering_fields = ['start_date', 'renewal_date', 'annual_premium_value']
    related_field_path = 'adviser' # for HierarchicalQuerySetMixin

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PolicyWriteSerializer
        if self.action == 'list':
            return PolicyListSerializer
        return PolicyDetailSerializer

class CommissionViewSet(BaseRelatedObjectViewSet):
    """API endpoint for insurance commissions with hierarchical permissions."""
    queryset = Commission.objects.select_related('policy__adviser').all()
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    related_field_path = 'policy__adviser'

class BaseInsuranceModifierViewSet(BaseModifierViewSet):
    """Базовый ViewSet для всех модификаторов страховой комиссии."""
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    related_field_path = 'commission__policy__adviser'

class RetentionViewSet(BaseInsuranceModifierViewSet):
    queryset = Retention.objects.all()
    serializer_class = RetentionSerializer

    @action(detail=True, methods=['post'], url_path='release')
    def release_retention(self, request, pk=None):
        """Marks the retention as released."""
        retention = self.get_object()
        retention.release()
        return Response({'status': 'retention released'}, status=status.HTTP_200_OK)

class ClawbackViewSet(BaseInsuranceModifierViewSet):
    queryset = Clawback.objects.all()
    serializer_class = ClawbackSerializer

    @action(detail=True, methods=['post'], url_path='recover')
    def recover_clawback(self, request, pk=None):
        """Marks the clawback as recovered."""
        clawback = self.get_object()
        clawback.recover()
        return Response({'status': 'clawback recovered'}, status=status.HTTP_200_OK)

class BonusViewSet(BaseInsuranceModifierViewSet):
    queryset = Bonus.objects.all()
    serializer_class = BonusSerializer

class OverrideViewSet(BaseInsuranceModifierViewSet):
    queryset = Override.objects.all()
    serializer_class = OverrideSerializer

class ReferralFeeViewSet(BaseInsuranceModifierViewSet):
    queryset = ReferralFee.objects.all()
    serializer_class = ReferralFeeSerializer

class IngestionViewSet(BaseDataIngestionViewSet):
    """ViewSet для обработки и отслеживания задач по импорту страховых данных."""
    queryset = InsuranceIngestionTask.objects.all()
    serializer_class = InsuranceIngestionTaskSerializer
    ingestion_serializer_class = InsuranceCommissionDataIngestionSerializer
    task_function = process_insurance_commission_ingestion
