from celery import shared_task
import time
import logging
from django.contrib.auth.models import User
from .models import Deal

logger = logging.getLogger(__name__)

@shared_task
def notify_deal_creation(deal_id):
    """
    Имитирует отправку уведомления о новой сделке.
    В реальном проекте здесь была бы отправка email или push-уведомлений.
    """
    try:
        deal = Deal.objects.get(id=deal_id)
        logger.info(f"Обработка уведомления для сделки: {deal.title}")

        # Имитация отправки уведомления
        time.sleep(3)

        logger.info(f"Уведомление успешно отправлено для сделки {deal.title} "
                   f"пользователю {deal.user.username}")

        return f"Уведомление для сделки '{deal.title}' отправлено"

    except Deal.DoesNotExist:
        logger.error(f"Сделка с ID {deal_id} не найдена")
        return f"Ошибка: сделка с ID {deal_id} не найдена"
    except Exception as e:
        logger.error(f"Ошибка при отправке уведомления для сделки {deal_id}: {str(e)}")
        return f"Ошибка при отправке уведомления: {str(e)}"
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

from apps.users.models import CustomUser
from apps.commission.models import Commission

@shared_task
def generate_and_send_commission_report(manager_id: int):
    """
    Генерирует отчет по комиссиям для команды менеджера и отправляет его на email.
    """
    try:
        manager = CustomUser.objects.get(id=manager_id)
    except CustomUser.DoesNotExist:
        # TODO: Добавить логирование
        return f"Manager with id={manager_id} not found."

    if not manager.email:
        return f"Manager with id={manager_id} has no email."

    team_members = manager.get_descendants(include_self=True)

    # Собираем данные
    commissions = Commission.objects.filter(user__in=team_members, status=Commission.Status.PAID)
    total_amount = sum(c.amount for c in commissions)

    context = {
        'manager_name': manager.get_full_name() or manager.username,
        'report_date': timezone.now().strftime('%d-%m-%Y'),
        'commissions': commissions,
        'total_amount': total_amount,
    }

    # Формируем тело письма из шаблона (пока просто строка)
    # В будущем можно использовать HTML-шаблоны
    subject = f"Commission Report for your team - {context['report_date']}"
    message = render_to_string('commission/email/report_template.txt', context)

    send_mail(
        subject=subject,
        message=message,
        from_email='reports@uk-commission-panel.com',
        recipient_list=[manager.email],
        fail_silently=False,
    )

    return f"Report sent to {manager.email} successfully."