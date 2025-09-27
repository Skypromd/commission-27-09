from django.db import models
from django.conf import settings
from backend.apps.core.models import Client, Adviser

class Lender(models.Model):
    """Represents a mortgage provider."""
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class MortgageCase(models.Model):
    """The central entity representing a single mortgage deal."""
    class Status(models.TextChoices):
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        OFFER_RECEIVED = 'OFFER_RECEIVED', 'Offer Received'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    case_number = models.CharField(max_length=100, unique=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='mortgage_cases')
    adviser = models.ForeignKey(Adviser, on_delete=models.SET_NULL, null=True, related_name='mortgage_cases')
    lender = models.ForeignKey(Lender, on_delete=models.CASCADE, related_name='mortgage_cases')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_PROGRESS)
    completion_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True) # Дата истечения срока
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    mortgage_expiry_reminder_sent = models.BooleanField(default=False)
    mortgage_expiry_reminder_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.case_number

class Commission(models.Model):
    """Represents the main procuration fee received from the lender."""
    mortgage_case = models.OneToOneField(MortgageCase, on_delete=models.CASCADE, related_name='commission')
    gross_commission = models.DecimalField(max_digits=10, decimal_places=2)
    net_commission = models.DecimalField(max_digits=10, decimal_places=2)
    date_received = models.DateField()

    def __str__(self):
        return f"Commission for {self.mortgage_case.case_number}"

class BrokerFee(models.Model):
    """A fee charged to the client at a specific stage."""
    class Stage(models.TextChoices):
        AIP = 'AIP', 'Agreement in Principle'
        OFFER = 'OFFER', 'Mortgage Offer'

    mortgage_case = models.ForeignKey(MortgageCase, on_delete=models.CASCADE, related_name='broker_fees')
    stage = models.CharField(max_length=10, choices=Stage.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending') # e.g., pending, paid, waived
    date_invoiced = models.DateField(null=True, blank=True)
    date_paid = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Broker Fee for {self.mortgage_case.case_number} at {self.get_stage_display()} stage"

class CommissionModifier(models.Model):
    """Abstract base model for all commission adjustments."""
    commission = models.ForeignKey(Commission, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

# Concrete Implementations for Mortgage Modifiers
class MortgageRetention(CommissionModifier): pass
class MortgageClawback(CommissionModifier): pass
class MortgageBonus(CommissionModifier): pass
class MortgageOverride(CommissionModifier): pass
class MortgageReferralFee(CommissionModifier): pass

class MortgageIngestionTask(models.Model):
    """Tracks the status of a data ingestion task."""
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    result = models.JSONField(null=True, blank=True) # To store errors or success messages
