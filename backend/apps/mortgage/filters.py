from django_filters import rest_framework as filters
from .models import MortgageCase, Commission

class MortgageCaseFilter(filters.FilterSet):
    """
    Фильтры для модели MortgageCase.
    """
    start_date = filters.DateFilter(field_name="created_at", lookup_expr='gte')
    end_date = filters.DateFilter(field_name="created_at", lookup_expr='lte')

    class Meta:
        model = MortgageCase
        fields = ['status', 'lender', 'adviser', 'product_type', 'start_date', 'end_date']


class CommissionFilter(filters.FilterSet):
    """
    Фильтры для мо��ели Commission.
    """
    start_date = filters.DateFilter(field_name="mortgage_case__created_at", lookup_expr='gte')
    end_date = filters.DateFilter(field_name="mortgage_case__created_at", lookup_expr='lte')

    class Meta:
        model = Commission
        fields = ['payment_status', 'start_date', 'end_date']
