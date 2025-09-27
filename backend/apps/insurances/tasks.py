from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from .models import Policy, InsuranceIngestionTask
from .ingestion import process_insurance_commission_statement_logic

@shared_task
def send_policy_renewal_reminders():
    """
    Отправляет email-уведомления для страховых полисов, которые скоро требуют продления.
    Срабатывает за 30 дней до даты продления.
    """
    thirty_days_from_now = timezone.now().date() + timedelta(days=30)
    today = timezone.now().date()

    # Находим активные полисы, требующие продления в ближайшие 30 дней, по которым не было уведомления
    expiring_policies = Policy.objects.filter(
        status=Policy.PolicyStatus.ACTIVE,
        renewal_date__gte=today,
        renewal_date__lte=thirty_days_from_now,
        renewal_reminder_sent=False
    )

    count = 0
    for policy in expiring_policies:
        if policy.adviser and hasattr(policy.adviser, 'user') and policy.adviser.user.email:
            send_mail(
                'Policy Renewal Reminder',
                f'Dear {policy.adviser.user.get_full_name()},\n\n'
                f'This is a reminder that the insurance policy for client {policy.client} '
                f'(policy number {policy.policy_number}) is due for renewal on {policy.renewal_date}.',
                'from@example.com',
                [policy.adviser.user.email],
                fail_silently=False,
            )

            # Помечаем, что уведомление отправлено
            policy.renewal_reminder_sent = True
            policy.renewal_reminder_date = timezone.now().date()
            policy.save(update_fields=['renewal_reminder_sent', 'renewal_reminder_date'])
            count += 1

    return f"Sent {count} policy renewal reminders."

@shared_task(bind=True)
def process_insurance_commission_ingestion(self, data, user_id):
    """
    Асинхро��ная задача для обработки файла с комиссиями.
    """
    task_id = self.request.id
    try:
        # Получ��ем объект задачи, чтобы обновлять его статус
        task = InsuranceIngestionTask.objects.get(id=task_id)
        task.status = InsuranceIngestionTask.Status.IN_PROGRESS
        task.save()

        # Данные приходят как словарь от BaseDataIngestionViewSet
        file_content = data['file_content']

        # Вызываем основную логику
        result = process_insurance_commission_statement_logic(file_content)

        # Обновляем задачу результатом
        task.status = InsuranceIngestionTask.Status.SUCCESS if result['status'] == 'success' else InsuranceIngestionTask.Status.FAILED
        task.result = result
        task.save()

        return result

    except Exception as e:
        # В случае непредвиденной ошибки
        task = InsuranceIngestionTask.objects.filter(id=task_id).first()
        if task:
            task.status = InsuranceIngestionTask.Status.FAILED
            task.result = {'errors': [f'Неожиданная ошибка выполнения задачи: {str(e)}']}
            task.save()
        return {'status': 'failed', 'errors': [str(e)]}
