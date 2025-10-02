# -*- coding: utf-8 -*-
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

from apps.policies.models import Policy
from apps.advisers.models import Adviser
from apps.products.models import Product


class Commission(models.Model):
    """
    Модель для хранения данных о комиссиях.
    """
    class CommissionType(models.TextChoices):
        DIRECT = 'DIRECT', 'Прямая'
        OVERRIDE = 'OVERRIDE', 'Оверрайд'

    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Ожидается'
        PROCESSING = 'PROCESSING', 'В обработке'
        PAID = 'PAID', 'Выплачено'
        CANCELLED = 'CANCELLED', 'Отменено'

    policy = models.OneToOneField(
        Policy,
        on_delete=models.CASCADE,
        related_name='commission'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='commissions')
    adviser = models.ForeignKey(Adviser, on_delete=models.CASCADE, related_name='commissions')
    gross_commission = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The total gross amount received from the insurer."
    )
    net_commission = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The amount after any deductions from the insurer."
    )
    adviser_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))],
        help_text="The percentage of the net commission the adviser earns."
    )
    adviser_fee_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The calculated fee amount for the adviser before adjustments."
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    date_received = models.DateField(help_text="Date the commission was received from the insurer.")
    date_paid_to_adviser = models.DateField(null=True, blank=True)
    commission_type = models.CharField(
        "Тип комиссии",
        max_length=10,
        choices=CommissionType.choices,
        default=CommissionType.DIRECT
    )

    # Financial Details from extended plan
    vat_included = models.BooleanField(default=False)
    commission_invoice_number = models.CharField(max_length=100, blank=True)
    commission_due_date = models.DateField(null=True, blank=True)
    currency_code = models.CharField(max_length=3, default='GBP')
    payment_method = models.CharField(max_length=50, blank=True)
    payment_reference = models.CharField(max_length=255, blank=True)

    # Integration
    integration_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Автоматически рассчитываем вознаграждение консультанта
        self.adviser_fee_amount = self.net_commission * (self.adviser_fee_percentage / Decimal(100))

        is_new = self._state.adding
        super().save(*args, **kwargs)

        # Если это новая прямая комиссия, создаем оверрайды для руководителей
        if is_new and self.commission_type == self.CommissionType.DIRECT:
            self.create_overrides()

    def create_overrides(self):
        """Создает оверрайдные комиссии для иерархии руководителей."""
        current_adviser = self.adviser
        last_fee_percentage = self.adviser_fee_percentage

        while current_adviser and current_adviser.parent_adviser:
            manager = current_adviser.parent_adviser

            # Ов��ррайд = (процент менеджера - процент подчиненного) * чистая комиссия
            override_percentage = manager.fee_percentage - last_fee_percentage
            if override_percentage > 0:
                override_amount = self.net_commission * (override_percentage / 100)

                Override.objects.create(
                    commission=self,
                    recipient=manager,
                    amount=override_amount,
                    reason=f"Override from {current_adviser.user.get_full_name()}"
                )

            current_adviser = manager
            last_fee_percentage = manager.fee_percentage

    def __str__(self):
        return f"Commission for {self.policy.policy_number}"


class CommissionModifier(models.Model):
    """
    An abstract base model for any adjustment to a commission.
    """
    commission = models.ForeignKey(Commission, on_delete=models.CASCADE, related_name="%(class)ss")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Value of the modification (can be negative for deductions).")
    reason = models.CharField(max_length=255)
    status = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.__class__.__name__} of {self.amount} for {self.commission.policy.policy_number}"


class Retention(CommissionModifier):
    """
    An amount held back from the adviser's fee.
    """
    is_released = models.BooleanField(default=False, help_text="Indicates if the retention has been paid back.")
    release_date = models.DateField(null=True, blank=True)
    retention_period = models.IntegerField(null=True, blank=True, help_text="Retention period in months.")


class Clawback(CommissionModifier):
    """
    A commission amount that must be returned (e.g., policy cancelled).
    Amount should be negative.
    """
    class ClawbackStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        RECOVERED = 'RECOVERED', 'Recovered'

    status = models.CharField(max_length=20, choices=ClawbackStatus.choices, default=ClawbackStatus.PENDING)
    clawback_period = models.IntegerField(null=True, blank=True, help_text="Clawback period in months.")


class Bonus(CommissionModifier):
    """
    An additional bonus payment. Amount should be positive.
    """
    kpi_type = models.CharField(max_length=100, blank=True, help_text="e.g., New Business Volume, Cross-sell")
    kpi_achieved = models.BooleanField(default=False)


class Override(CommissionModifier):
    """
    A commission paid to a parent adviser/manager.
    """
    recipient = models.ForeignKey(Adviser, on_delete=models.PROTECT, related_name='override_commissions')


class ReferralFee(CommissionModifier):
    """
    A fee paid to a referrer for a policy.
    """
    referral_source_name = models.CharField(max_length=255)
    referral_source_type = models.CharField(max_length=100, blank=True)
    referral_agreement_id = models.CharField(max_length=100, blank=True)


# --- Новые модели ---

class CommissionSplit(models.Model):
    """Разделение вознаграждения по одной комиссии между несколькими консультантами."""
    commission = models.ForeignKey(Commission, on_delete=models.CASCADE, related_name="splits")
    adviser = models.ForeignKey(Adviser, on_delete=models.PROTECT, related_name="commission_splits")
    split_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01')), MaxValueValidator(Decimal('100.00'))]
    )
    split_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Рассчитанная сумма разделения")

    def save(self, *args, **kwargs):
        self.split_amount = self.commission.adviser_fee_amount * (self.split_percentage / Decimal(100))
        super().save(*args, **kwargs)

class Advance(models.Model):
    """Аванс, выданный консультанту."""
    adviser = models.ForeignKey(Adviser, on_delete=models.PROTECT, related_name="advances")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_issued = models.DateField()
    is_fully_repaid = models.BooleanField(default=False)

class Repayment(models.Model):
    """Погашение аванса, обычно из комиссии."""
    advance = models.ForeignKey(Advance, on_delete=models.CASCADE, related_name="repayments")
    commission = models.ForeignKey(Commission, on_delete=models.SET_NULL, null=True, blank=True, related_name="repayments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_repaid = models.DateField()

class VestingSchedule(models.Model):
    """График вестинга для бонусов или других отложенных выплат."""
    name = models.CharField(max_length=255)
    vesting_period_months = models.IntegerField()
    cliff_months = models.IntegerField(default=0)

class ScheduledPayout(models.Model):
    """Запланированная выплата по графику вестинга."""
    schedule = models.ForeignKey(VestingSchedule, on_delete=models.CASCADE, related_name="payouts")
    commission = models.ForeignKey(Commission, on_delete=models.CASCADE, related_name="scheduled_payouts")
    payout_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
