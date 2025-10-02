from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from .models import MortgageCase, Commission, MortgageIngestionTask

@shared_task
def send_mortgage_expiry_reminders():
    """
    Отправляет email-уведомления для ипотечных кейсов, которые скоро истекают.
    Сраб��тывает за 4 месяца (120 дней) до даты истечения.
    """
    four_months_from_now = timezone.now().date() + timedelta(days=120)
    today = timezone.now().date()

    # Находим завершенные кейсы, истекающие в ближайшие 4 месяца, по которым не было уведомления
    expiring_cases = MortgageCase.objects.filter(
        status=MortgageCase.Status.COMPLETED,
        expiry_date__gte=today,
        expiry_date__lte=four_months_from_now,
        mortgage_expiry_reminder_sent=False
    )

    count = 0
    for case in expiring_cases:
        if case.adviser and hasattr(case.adviser, 'user') and case.adviser.user.email:
            send_mail(
                'Mortgage Expiry Reminder',
                f'Dear {case.adviser.user.get_full_name()},\n\n'
                f'This is a reminder that the mortgage for client {case.client} '
                f'(case number {case.case_number}) is expiring on {case.expiry_date}.',
                'from@example.com',
                [case.adviser.user.email],
                fail_silently=False,
            )

            # Помечаем, что уведомление отправлено
            case.mortgage_expiry_reminder_sent = True
            case.mortgage_expiry_reminder_date = timezone.now().date()
            case.save(update_fields=['mortgage_expiry_reminder_sent', 'mortgage_expiry_reminder_date'])
            count += 1

    return f"Sent {count} mortgage expiry reminders."

@shared_task(bind=True)
def process_mortgage_commission_ingestion(self, commission_data, ingestion_task_id):
    """
    Асинхронная задача для обработки импортированных данных по ипотечным комиссиям.
    """
    try:
        task_record = MortgageIngestionTask.objects.get(id=ingestion_task_id)
        task_record.status = MortgageIngestionTask.Status.IN_PROGRESS
        task_record.save()

        # Здесь будет основная логика обработки данных
        # Например, создание или обновление записей Commission
        processed_count = 0
        errors = []
        for item in commission_data:
            case_number = item['case_number']
            try:
                case = MortgageCase.objects.get(case_number=case_number)
                commission, created = Commission.objects.update_or_create(
                    mortgage_case=case,
                    defaults={
                        'gross_commission': item['gross_commission'],
                        'date_received': item['date_received'],
                        'payment_status': 'Processed'
                    }
                )
                processed_count += 1
            except MortgageCase.DoesNotExist:
                errors.append(f"Case with number {case_number} not found.")
            except Exception as e:
                errors.append(f"Error processing case {case_number}: {str(e)}")

        task_record.status = MortgageIngestionTask.Status.SUCCESS
        task_record.report = {'processed': processed_count, 'errors': errors}
        task_record.finished_at = timezone.now()
        task_record.save()

    except Exception as e:
        if 'task_record' in locals():
            task_record.status = MortgageIngestionTask.Status.FAILURE
            task_record.report = {'fatal_error': str(e)}
            task_record.finished_at = timezone.now()
            task_record.save()
