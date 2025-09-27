from django.db.models import Count, Sum
from .models import MortgageCase

def get_adviser_performance_report(queryset):
    """
    Generates a performance report for advisers based on a given queryset of mortgage cases.
    """
    report = queryset.values('adviser__user__username').annotate(
        case_count=Count('id'),
        total_loan_amount=Sum('loan_amount'),
        total_gross_commission=Sum('commission__gross_commission')
    ).order_by('-total_gross_commission')
    return report

def get_lender_performance_report(start_date=None, end_date=None):
    """
    Generates a performance report grouped by lender for mortgages.
    """
    queryset = MortgageCase.objects.filter(status=MortgageCase.Status.COMPLETED)
    if start_date:
        queryset = queryset.filter(completion_date__gte=start_date)
    if end_date:
        queryset = queryset.filter(completion_date__lte=end_date)

    report = queryset.values('lender__name').annotate(
        case_count=Count('id'),
        total_loan_amount=Sum('loan_amount'),
        total_gross_commission=Sum('commission__gross_commission')
    ).order_by('-total_gross_commission')

    return report
