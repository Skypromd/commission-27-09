from django.db import models
from django.conf import settings

class Adviser(models.Model):
    class AdviserStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Активен'
        ON_LEAVE = 'ON_LEAVE', 'В отпуске'
        TERMINATED = 'TERMINATED', 'Уволен'

    class AdviserRole(models.TextChoices):
        ADVISER = 'ADVISER', 'Консультант'
        MANAGER = 'MANAGER', 'Менеджер'
        TRAINEE = 'TRAINEE', 'Стажер'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='adviser_profile'
    )
    parent_adviser = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subordinates'
    )
    start_date = models.DateField("Дата начала работы")
    termination_date = models.DateField("Дата увольнения", null=True, blank=True)
    fee_percentage = models.DecimalField(
        "Процент вознаграждения",
        max_digits=5,
        decimal_places=2,
        default=80.00,
        help_text="Процент вознаграждения консультанта от комиссии",
    )
    status = models.CharField(
        "Статус",
        max_length=20,
        choices=AdviserStatus.choices,
        default=AdviserStatus.ACTIVE
    )
    role = models.CharField(
        "Роль",
        max_length=20,
        choices=AdviserRole.choices,
        default=AdviserRole.ADVISER
    )

    def __str__(self):
        name = self.user.get_full_name() or self.user.username
        return f"{name} ({self.role})"

    class Meta:
        verbose_name = "Консультант"
        verbose_name_plural = "Консультанты"
