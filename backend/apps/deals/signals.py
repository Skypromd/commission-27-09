from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Deal
from apps.commission.services import CommissionCalculationEngine

@receiver(pre_save, sender=Deal)
def on_deal_stage_change(sender, instance, **kwargs):
    """
    Сигнал, который срабатывает ПЕРЕД сохранением сделки.
    Если стадия меняется на "закрывающую", запускается расчет комиссии.
    """
    if instance.pk is None: # Новая сделка
        return

    try:
        old_instance = Deal.objects.get(pk=instance.pk)
    except Deal.DoesNotExist:
        return

    # Проверяем, что стадия изменилась и новая стадия - закрывающая
    if instance.stage and instance.stage.is_closing_stage and old_instance.stage != instance.stage:
        from django.db import transaction
        print(f"Сделка #{instance.id} переходит на закрывающую стадию. Запуск расчета комиссии...")
        transaction.on_commit(lambda: CommissionCalculationEngine.calculate_for_deal(instance))

