from datetime import timedelta
from celery import shared_task
from django.utils import timezone

from apps.mortgage.models import MortgageCase
from .models import Notification


@shared_task
def check_expiring_mortgages():
    """
    Находит ипотеки, срок которых истекает в ближайшие 90 дней,
    и создает уведомления для кредитных менеджеров.
    """
    ninety_days_from_now = timezone.now().date() + timedelta(days=90)
    expiring_cases = MortgageCase.objects.filter(
        closing_date__lte=ninety_days_from_now,
        closing_date__gte=timezone.now().date(),
        status=MortgageCase.Status.CLOSED,
        loan_officer__isnull=False
    ).select_related('loan_officer')

    for case in expiring_cases:
        message = (
            f"Внимание: Срок ипотеки для клиента '{case.borrower.get_full_name() or case.borrower.username}' "
            f"(дело №{case.id}) истекает {case.closing_date.strftime('%d-%m-%Y')}."
        )

        # Создаем уведомление, если его еще нет
        Notification.objects.get_or_create(
            user=case.loan_officer,
            message=message,
            content_object=case,
            defaults={'is_read': False}
        )

    return f"Проверено {expiring_cases.count()} истекающих ипотек."

