from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .utils import send_notification_to_staff, send_notification

@receiver(post_save, sender=User)
def notify_on_new_user(sender, instance, created, **kwargs):
    """Отправляет уведомление администраторам при создании нового пользователя"""
    if created:
        send_notification_to_staff(
            message=f'В системе зарегистрирован новый пользователь: {instance.username}',
            notification_type='info'
        )

# Раскомментируйте для реальной модели Commission
"""
@receiver(post_save, sender='commissions.Commission')
def notify_on_commission_status_change(sender, instance, created, **kwargs):
    if not created and hasattr(instance, 'get_dirty_fields') and 'status' in instance.get_dirty_fields():
        old_status = instance.get_dirty_fields()['status']
        new_status = instance.status
        
        # Уведомление для администраторов
        send_notification_to_staff(
            message=f'Статус комиссии #{instance.id} изменен с "{old_status}" на "{new_status}"',
            notification_type='info'
        )
        
        # Уведомление для владельца комиссии
        if hasattr(instance, 'owner') and instance.owner:
            send_notification(
                user=instance.owner,
                message=f'Статус вашей комиссии #{instance.id} изменен на "{new_status}"',
                notification_type='info'
            )
"""

