from django.db import models
from decimal import Decimal
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.core.models import Client, Adviser
from django.conf import settings

class Insurer(models.Model):
    """Represents an insurance company."""
    name = models.CharField(max_length=255, unique=True)
    contact_details = models.TextField(blank=True)
    fca_reference_number = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True)
    default_gross_commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=20.00,
        help_text="Default gross commission rate as a percentage of APV (e.g., 20.00 for 20%)."
    )
    default_net_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=90.00,
        help_text="Default net commission as a percentage of the gross commission (e.g., 90.00 for 90%)."
    )

    def __str__(self):
        return self.name

class InsuranceType(models.Model):
    """Represents the type of insurance."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    default_gross_commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True, blank=True,
        help_text="Override gross commission rate for this type of insurance (as a percentage of APV)."
    )
    default_net_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True, blank=True,
        help_text="Override net rate for this type of insurance (as a percentage of gross commission)."
    )

    def __str__(self):
        return self.name

class Policy(models.Model):
    """Represents a single insurance policy."""
    class PolicyStatus(models.TextChoices):
        IN_REVIEW = 'IN_REVIEW', 'In Review'
        ACTIVE = 'ACTIVE', 'Active'
        CANCELLED = 'CANCELLED', 'Cancelled'
        LAPSED = 'LAPSED', 'Lapsed'

    policy_number = models.CharField(max_length=100, unique=True)
    insurer = models.ForeignKey(Insurer, on_delete=models.PROTECT)
    client = models.ForeignKey(Client, on_delete=models.PROTECT)
    adviser = models.ForeignKey(
        Adviser,
        on_delete=models.SET_NULL,
        null=True,
        related_name='policies'
    )

    insurance_type = models.ForeignKey(InsuranceType, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=PolicyStatus.choices, default=PolicyStatus.IN_REVIEW)

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    renewal_date = models.DateField(null=True, blank=True)

    coverage_amount = models.DecimalField(max_digits=12, decimal_places=2)
    monthly_premium = models.DecimalField(max_digits=10, decimal_places=2)
    annual_premium_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    policy_currency_code = models.CharField(max_length=3, default='GBP')

    # Data and Documents
    commission_data = models.JSONField(null=True, blank=True, help_text="Raw commission statement data from insurer.")
    policy_document_links = models.JSONField(null=True, blank=True, help_text="Links to policy documents.")
    digital_signature_status = models.CharField(max_length=50, blank=True)

    # Analytics and Client Info
    client_source = models.CharField(max_length=100, blank=True)
    risk_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    cross_sell_opportunity = models.BooleanField(default=False)
    upsell_opportunity = models.BooleanField(default=False)

    # Complaints and Amendments
    client_complaint_flag = models.BooleanField(default=False)
    client_complaint_details = models.TextField(blank=True)
    policy_amendment_flag = models.BooleanField(default=False)
    policy_amendment_details = models.TextField(blank=True)

    # Lifecycle and History
    policy_cancellation_date = models.DateField(null=True, blank=True)
    policy_cancellation_reason = models.TextField(blank=True)

    # Поля для системы раннего оповещения
    renewal_reminder_sent = models.BooleanField(default=False)
    renewal_reminder_date = models.DateField(null=True, blank=True)

    # Системные поля
    legacy_policy_flag = models.BooleanField(default=False)
    legacy_policy_notes = models.TextField(blank=True)

    # Integration
    integration_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Automatically calculate APV if not provided
        if self.monthly_premium and not self.annual_premium_value:
            self.annual_premium_value = self.monthly_premium * 12
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Policy {self.policy_number} for {self.client}"

# --- Commission Models Moved Here ---

class Commission(models.Model):
    """
    Represents the primary commission payment for a single policy.
    """
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSED = 'PROCESSED', 'Processed'
        PAID = 'PAID', 'Paid'
        ON_HOLD = 'ON_HOLD', 'On Hold'
        CLAWBACK = 'CLAWBACK', 'Clawback Initiated'
        CANCELLED = 'CANCELLED', 'Cancelled'

    policy = models.OneToOneField(
        Policy,
        on_delete=models.CASCADE,
        related_name='commission'
    )
    gross_commission = models.DecimalField(max_digits=10, decimal_places=2, help_text="The total gross amount received from the insurer.")
    net_commission = models.DecimalField(max_digits=10, decimal_places=2, help_text="The amount after any deductions from the insurer.")
    adviser_fee_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))],
        help_text="The percentage of the net commission the adviser earns."
    )
    adviser_fee_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="The calculated fee amount for the adviser before adjustments.")
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    date_received = models.DateField(help_text="Date the commission was received from the insurer.")
    date_paid_to_adviser = models.DateField(null=True, blank=True)
    vat_included = models.BooleanField(default=False)
    commission_invoice_number = models.CharField(max_length=100, blank=True)
    commission_due_date = models.DateField(null=True, blank=True)
    currency_code = models.CharField(max_length=3, default='GBP')
    payment_method = models.CharField(max_length=50, blank=True)
    payment_reference = models.CharField(max_length=255, blank=True)
    payment_attachment_links = models.JSONField(null=True, blank=True, help_text="Links to payment documents.")
    forecasted_commission = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    integration_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.adviser_fee_amount = self.net_commission * (self.adviser_fee_percentage / Decimal(100))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Commission for {self.policy.policy_number}"

class CommissionModifier(models.Model):
    """ An abstract base model for any adjustment to a commission. """
    commission = models.ForeignKey(Commission, on_delete=models.CASCADE, related_name="%(class)s_set")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Value of the modification (can be negative for deductions).")
    reason = models.CharField(max_length=255)
    status = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.__class__.__name__} of {self.amount} for {self.commission.policy.policy_number}"

class Retention(CommissionModifier):
    is_released = models.BooleanField(default=False, help_text="Indicates if the retention has been paid back.")
    release_date = models.DateField(null=True, blank=True)
    retention_period = models.IntegerField(null=True, blank=True, help_text="Retention period in months.")

    def release(self):
        """Marks the retention as released."""
        if not self.is_released:
            self.is_released = True
            self.release_date = timezone.now().date()
            self.save(update_fields=['is_released', 'release_date'])

class Clawback(CommissionModifier):
    class ClawbackStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        RECOVERED = 'RECOVERED', 'Recovered'
    status = models.CharField(max_length=20, choices=ClawbackStatus.choices, default=ClawbackStatus.PENDING)
    clawback_period = models.IntegerField(null=True, blank=True, help_text="Clawback period in months.")
    # Chargeback and Write-off details
    chargeback_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    chargeback_reason = models.CharField(max_length=255, blank=True)
    write_off_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    write_off_reason = models.CharField(max_length=255, blank=True)
    write_off_date = models.DateField(null=True, blank=True)

    def recover(self):
        """Marks the clawback as recovered."""
        if self.status != self.ClawbackStatus.RECOVERED:
            self.status = self.ClawbackStatus.RECOVERED
            self.save(update_fields=['status'])

class Bonus(CommissionModifier):
    kpi_type = models.CharField(max_length=100, blank=True, help_text="e.g., New Business Volume, Cross-sell")
    kpi_achieved = models.BooleanField(default=False)

class Override(CommissionModifier):
    recipient = models.ForeignKey(Adviser, on_delete=models.PROTECT, related_name='override_commissions')

class ReferralFee(CommissionModifier):
    pass

class InsuranceIngestionTask(models.Model):
    """Tracks the status of a data ingestion task for insurance."""
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    result = models.JSONField(null=True, blank=True)
