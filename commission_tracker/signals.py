from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .tasks import send_generic_status_change_email


def register_status_change_signals(model_class):
    """
    Фабрика, которая создает и подключает обработчики сигналов
    pre_save и post_save для указанной модели.
    """

    @receiver(pre_save, sender=model_class, weak=False)
    def store_old_status(sender, instance, **kwargs):
        if instance.pk:
            try:
                instance._old_status = sender.objects.get(pk=instance.pk).status
            except sender.DoesNotExist:
                instance._old_status = None

    @receiver(post_save, sender=model_class, weak=False)
    def trigger_status_change_notification(sender, instance, created, **kwargs):
        old_status = getattr(instance, '_old_status', None)
        if not created and old_status is not None and old_status != instance.status:
            content_type = ContentType.objects.get_for_model(instance)
            send_generic_status_change_email.delay(
                content_type.id, instance.id, old_status, instance.status
            )

