from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.mortgage.models import Mortgage
from apps.policies.models import Policy


class DashboardStatsView(APIView):
    """
    API-представление для сбора статистики для главной панели управления.
    Выполняет все расчеты на стороне базы данных для максимальной производительности.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Получаем queryset в зависимости от роли пользователя
        if request.user.is_staff:
            mortgages_qs = Mortgage.objects.all()
            policies_qs = Policy.objects.all()
        else:
            mortgages_qs = Mortgage.objects.filter(user=request.user)
            policies_qs = Policy.objects.filter(user=request.user)

        # Агрегируем данные
        total_mortgages = mortgages_qs.count()
        total_policies = policies_qs.count()
        total_loan_amount = mortgages_qs.aggregate(total=Sum('loan_amount'))['total'] or 0
        total_premium_amount = policies_qs.aggregate(total=Sum('premium_amount'))['total'] or 0

        # Группируем по статусам
        mortgage_status_counts = list(mortgages_qs.values('status').annotate(value=Count('id')).order_by('-value'))
        policy_status_counts = list(policies_qs.values('status').annotate(value=Count('id')).order_by('-value'))

        # Объединяем статусы
        status_counts = {}
        for item in mortgage_status_counts + policy_status_counts:
            status_counts[item['status']] = status_counts.get(item['status'], 0) + item['value']

        deals_by_status = [{'name': status, 'value': value} for status, value in status_counts.items()]

        data = {
            'total_mortgages': total_mortgages,
            'total_policies': total_policies,
            'total_loan_amount': total_loan_amount,
            'total_premium_amount': total_premium_amount,
            'deals_by_status': deals_by_status,
        }

        return Response(data)

