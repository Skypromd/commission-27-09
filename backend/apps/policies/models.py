from django.db import models
from backend.apps.advisers.models import Adviser

class Policy(models.Model):
    """Модель для хранения информации о страховых полисах."""
    class PolicyStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Активен'
        INACTIVE = 'INACTIVE', 'Неактивен'
        CANCELLED = 'CANCELLED', 'Аннулирован'

    policy_number = models.CharField("Номер полиса", max_length=255, unique=True)
    adviser = models.ForeignKey(Adviser, on_delete=models.PROTECT, related_name='policies')
    provider = models.CharField("Страховая компания", max_length=255)
    status = models.CharField("Статус", max_length=20, choices=PolicyStatus.choices, default=PolicyStatus.ACTIVE)
    date_issued = models.DateField("Дата выдачи")

    class Meta:
        verbose_name = "Полис"
        verbose_name_plural = "Полисы"

    def __str__(self):
        return self.policy_number

