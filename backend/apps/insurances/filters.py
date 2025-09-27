import django_filters
from .models import Policy, Commission

class PolicyFilter(django_filters.FilterSet):
    """
    Advanced filter for Policies.
    """
    client_name = django_filters.CharFilter(field_name='client__name', lookup_expr='icontains')
    insurer_name = django_filters.CharFilter(field_name='insurer__name', lookup_expr='icontains')
    start_date = django_filters.DateFromToRangeFilter()
    renewal_date = django_filters.DateFromToRangeFilter()
    commission_payment_status = django_filters.ChoiceFilter(
        field_name='commission__payment_status',
        choices=Commission.PaymentStatus.choices
    )

    class Meta:
        model = Policy
        fields = {
            'status': ['exact'],
            'insurance_type': ['exact'],
            'adviser': ['exact'],
            'client_name': ['icontains'],
            'insurer_name': ['icontains'],
            'start_date': ['exact', 'gte', 'lte'],
            'renewal_date': ['exact', 'gte', 'lte'],
            'commission_payment_status': ['exact'],
        }
