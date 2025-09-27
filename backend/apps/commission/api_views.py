"""
[IDE FIX] Ошибки "Unresolved reference"? См. INTERPRETER_SETUP.md в корне проекта.
"""
from decimal import Decimal
from django.db.models import Sum, Count, Q
from rest_framework import viewsets, permissions, views, serializers
from rest_framework.response import Response
from .models import Commission, Retention, Clawback, CommissionSplit, Advance, Repayment, Bonus, VestingSchedule, ScheduledPayout, ReferralFee, Override
from backend.apps.advisers.models import Adviser
from .serializers import (
    CommissionSerializer, RetentionSerializer, ClawbackSerializer,
    CommissionSplitSerializer, AdvanceSerializer, RepaymentSerializer,
    BonusSerializer, VestingScheduleSerializer, ScheduledPayoutSerializer,
    ReferralFeeSerializer, OverrideSerializer
)
from backend.apps.advisers.serializers import AdviserSerializer
from backend.apps.core.permissions import IsOwnerOrManager


def get_commissions_for_user(user):
    """Возвращает queryset комиссий, доступных пользователю."""
    base_queryset = Commission.objects.select_related(
        'policy', 'product', 'adviser__user'
    ).prefetch_related(
        'overrides__recipient__user'
    )

    if user.is_staff:
        return base_queryset.all()

    if hasattr(user, 'adviser_profile'):
        user_adviser = user.adviser_profile
        # Консультант видит свои комиссии + оверрайды, где он получатель
        direct_commissions = Q(adviser=user_adviser)
        override_commissions = Q(overrides__recipient=user_adviser)

        # Менеджер ��ополнительно видит комиссии своих подчиненных
        subordinate_advisers = user_adviser.subordinates.all()
        if subordinate_advisers.exists():
            direct_commissions |= Q(adviser__in=subordinate_advisers)

        return base_queryset.filter(direct_commissions | override_commissions).distinct()

    return Commission.objects.none()


class CommissionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра комиссий.
    - Администраторы видят все.
    - Менеджеры видят свои комиссии и комиссии своей команды.
    - Консультанты видят только свои.
    """
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]

    def get_queryset(self):
        return get_commissions_for_user(self.request.user)


class OverrideViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра только оверрайдных комиссий.
    """
    queryset = Override.objects.all()
    serializer_class = OverrideSerializer
    permission_classes = [permissions.IsAdminUser]


# --- ViewSets for Modifiers (Manager Access Only) ---

class RetentionViewSet(viewsets.ModelViewSet):
    queryset = Retention.objects.all()
    serializer_class = RetentionSerializer
    permission_classes = [permissions.IsAdminUser]


class ClawbackViewSet(viewsets.ModelViewSet):
    queryset = Clawback.objects.all()
    serializer_class = ClawbackSerializer
    permission_classes = [permissions.IsAdminUser]


class CommissionBonusViewSet(viewsets.ModelViewSet):
    queryset = Bonus.objects.all()
    serializer_class = BonusSerializer
    permission_classes = [permissions.IsAdminUser]


class ReferralFeeViewSet(viewsets.ModelViewSet):
    queryset = ReferralFee.objects.all()
    serializer_class = ReferralFeeSerializer
    permission_classes = [permissions.IsAdminUser]

# --- ViewSets для новых моделей ---

class CommissionSplitViewSet(viewsets.ModelViewSet):
    queryset = CommissionSplit.objects.all()
    serializer_class = CommissionSplitSerializer
    permission_classes = [permissions.IsAdminUser]

class AdvanceViewSet(viewsets.ModelViewSet):
    queryset = Advance.objects.all()
    serializer_class = AdvanceSerializer
    permission_classes = [permissions.IsAdminUser]

class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer
    permission_classes = [permissions.IsAdminUser]

class VestingScheduleViewSet(viewsets.ModelViewSet):
    queryset = VestingSchedule.objects.all()
    serializer_class = VestingScheduleSerializer
    permission_classes = [permissions.IsAdminUser]

class ScheduledPayoutViewSet(viewsets.ModelViewSet):
    queryset = ScheduledPayout.objects.all()
    serializer_class = ScheduledPayoutSerializer
    permission_classes = [permissions.IsAdminUser]

# --- API Views ---

class CommissionStatisticsAPIView(views.APIView):
    """
    Предоставляет сводную статистику по комиссиям в зависимости от роли пользователя.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = get_commissions_for_user(request.user)
        stats = queryset.aggregate(
            total_net_commission=Sum('net_commission'),
            total_adviser_payout=Sum('adviser_fee_amount'),
            transaction_count=Count('id')
        )
        return Response({
            "total_net_commission": stats.get('total_net_commission') or 0,
            "total_adviser_payout": stats.get('total_adviser_payout') or 0,
            "transaction_count": stats.get('transaction_count') or 0,
        })

class TopPerformersAPIView(views.APIView):
    """
    Возвращает список лучших консультантов по сумме вознаграждения в рамках доступа пользователя.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = get_commissions_for_user(request.user)
        # Агрегируем вознаграждения по каждому консультанту
        top_performers = queryset.values(
            'adviser__user__first_name',
            'adviser__user__last_name'
        ).annotate(
            total_fees=Sum('adviser_fee_amount')
        ).order_by('-total_fees')

        # Ограничим вывод топ-10
        return Response(top_performers[:10])

class CommissionCalculatorAPIView(views.APIView):
    """
    Рассчитывает прямое вознаграждение и оверрайды для заданной суммы комиссии и консультанта.
    Не сохраняет данные в БД.
    """
    permission_classes = [permissions.IsAdminUser]

    class InputSerializer(serializers.Serializer):
        net_commission = serializers.DecimalField(max_digits=10, decimal_places=2)
        adviser_id = serializers.IntegerField()

    def post(self, request, *args, **kwargs):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        net_commission = data['net_commission']
        adviser_id = data['adviser_id']

        try:
            adviser = Adviser.objects.select_related('user', 'parent_adviser__user').get(id=adviser_id)
        except Adviser.DoesNotExist:
            return Response({"error": "Консультант не найден."}, status=404)

        calculation_details = []
        total_payout = Decimal('0.00')

        # 1. Прямое вознаграждение
        direct_fee = net_commission * (adviser.fee_percentage / 100)
        total_payout += direct_fee
        calculation_details.append({
            "adviser": adviser.user.get_full_name(),
            "type": "DIRECT",
            "fee_percentage": adviser.fee_percentage,
            "calculated_fee": direct_fee
        })

        # 2. Оверрайдные вознаграждения
        current_adviser = adviser
        last_fee_percentage = adviser.fee_percentage

        while current_adviser.parent_adviser:
            manager = current_adviser.parent_adviser
            override_percentage = manager.fee_percentage - last_fee_percentage

            if override_percentage > 0:
                override_fee = net_commission * (override_percentage / 100)
                total_payout += override_fee
                calculation_details.append({
                    "adviser": manager.user.get_full_name(),
                    "type": "OVERRIDE",
                    "fee_percentage": manager.fee_percentage,
                    "override_percentage": override_percentage,
                    "calculated_fee": override_fee
                })

            current_adviser = manager
            last_fee_percentage = manager.fee_percentage

        return Response({
            "source_net_commission": net_commission,
            "total_payout": total_payout,
            "payout_breakdown": calculation_details
        })


class MyProfileAPIView(views.APIView):
    """
    Возвращает сводную информацию для залогиненного пользователя.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'adviser_profile'):
            return Response({"error": "Профиль консультанта не найден."}, status=404)

        adviser_profile = user.adviser_profile
        commissions_qs = get_commissions_for_user(user)

        # 1. Профиль пользователя
        profile_data = AdviserSerializer(adviser_profile).data

        # 2. Статистика
        stats = commissions_qs.aggregate(
            total_net_commission=Sum('net_commission'),
            total_adviser_payout=Sum('adviser_fee_amount'),
            transaction_count=Count('id')
        )
        statistics_data = {
            "total_net_commission": stats.get('total_net_commission') or 0,
            "total_adviser_payout": stats.get('total_adviser_payout') or 0,
            "transaction_count": stats.get('transaction_count') or 0,
        }

        # 3. Последние 5 комиссий
        recent_commissions = commissions_qs.order_by('-date_received')[:5]
        recent_commissions_data = CommissionSerializer(recent_commissions, many=True).data

        # 4. Финансовая сводка (Авансы и Удержания)
        total_advances = adviser_profile.advances.filter(is_fully_repaid=False).aggregate(total=Sum('amount'))['total'] or 0
        total_repayments = Repayment.objects.filter(advance__adviser=adviser_profile, advance__is_fully_repaid=False).aggregate(total=Sum('amount'))['total'] or 0
        outstanding_advances = total_advances - total_repayments

        total_retentions = Retention.objects.filter(commission__adviser=adviser_profile, is_released=False).aggregate(total=Sum('amount'))['total'] or 0

        financial_summary = {
            "outstanding_advances": outstanding_advances,
            "total_retentions": total_retentions,
        }

        return Response({
            "profile": profile_data,
            "statistics": statistics_data,
            "recent_commissions": recent_commissions_data,
            "financial_summary": financial_summary,
        })
