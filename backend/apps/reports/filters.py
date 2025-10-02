from django_filters import rest_framework as filters
from apps.mortgage.models import Commission


class CommissionFilter(filters.FilterSet):
    """
    Фильтры для модели Commission, позволяющие фильтровать по связанным полям MortgageCase.
    """
    start_date = filters.DateFilter(field_name="mortgage_case__created_at", lookup_expr='gte')
    end_date = filters.DateFilter(field_name="mortgage_case__created_at", lookup_expr='lte')
    adviser = filters.NumberFilter(field_name='mortgage_case__adviser_id')
    lender = filters.CharFilter(field_name='mortgage_case__lender__name', lookup_expr='icontains')
    status = filters.CharFilter(field_name='mortgage_case__status')

    class Meta:
        model = Commission
        fields = ['start_date', 'end_date', 'adviser', 'lender', 'status']
