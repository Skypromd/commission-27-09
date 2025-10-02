from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class Notification(models.Model):
    """Модель для хранения уведомлений пользователей"""

    class NotificationType(models.TextChoices):
        INFO = 'info', _('Информация')
        WARNING = 'warning', _('Предупреждение')
        ERROR = 'error', _('Ошибка')
        SUCCESS = 'success', _('Успех')

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_('Пользователь')
    )
    message = models.TextField(_('Сообщение'))
    notification_type = models.CharField(
        _('Тип уведомления'),
        max_length=10,
        choices=NotificationType.choices,
        default=NotificationType.INFO
    )
    created_at = models.DateTimeField(_('Создано'), auto_now_add=True)
    read = models.BooleanField(_('Прочитано'), default=False)
    link = models.CharField(_('Ссылка'), max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Уведомление')
        verbose_name_plural = _('Уведомления')

    def __str__(self):
        return f"{self.get_notification_type_display()}: {self.message[:30]}..."
