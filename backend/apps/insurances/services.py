from decimal import Decimal
from django.db import transaction
from .models import Policy, Commission, Override, Clawback

@transaction.atomic
def create_commission_for_policy(policy: Policy):
    """
    Service function to create a commission and its related objects for a given policy.
    Encapsulates all business logic for commission creation.
    """
    # 1. Pre-condition checks
    if not policy.annual_premium_value:
        return None # Cannot create commission without APV
    if hasattr(policy, 'commission'):
        return policy.commission # Commission already exists

    # 2. Determine commission rates with override logic
    insurer = policy.insurer
    insurance_type = policy.insurance_type
    gross_rate_pct = insurance_type.default_gross_commission_rate or insurer.default_gross_commission_rate
    net_rate_pct = insurance_type.default_net_rate or insurer.default_net_rate
    gross_rate = gross_rate_pct / Decimal(100)
    net_rate = net_rate_pct / Decimal(100)

    # 3. Calculate placeholder values
    gross_commission_placeholder = policy.annual_premium_value * gross_rate
    net_commission_placeholder = gross_commission_placeholder * net_rate

    adviser = policy.adviser
    # Calculate adviser_fee_amount based on net_commission and adviser's percentage
    adviser_fee_amount_calculated = net_commission_placeholder * (adviser.default_commission_percentage / Decimal(100))

    # 4. Create the main Commission object
    commission = Commission.objects.create(
        policy=policy,
        gross_commission=gross_commission_placeholder,
        net_commission=net_commission_placeholder,
        adviser_fee_percentage=adviser.default_commission_percentage,
        adviser_fee_amount=adviser_fee_amount_calculated, # Добавляем вычисленную сумму
        date_received=policy.updated_at.date()
    )

    # 5. Handle Override Commission creation
    if adviser.parent_adviser and adviser.parent_adviser.active_flag:
        manager = adviser.parent_adviser
        override_amount = commission.net_commission * (manager.default_override_percentage / Decimal(100))

        Override.objects.create(
            commission=commission,
            recipient=manager,
            amount=override_amount,
            reason=f"Override from {adviser.user.get_full_name()}"
        )

    return commission


@transaction.atomic
def handle_policy_cancellation_service(policy: Policy):
    """
    Service function to handle all logic when a policy is cancelled.
    Creates clawbacks for adviser and any overrides.
    """
    if not hasattr(policy, 'commission'):
        return # No commission to claw back

    commission = policy.commission

    # 1. Create clawback for the adviser's fee
    if not Clawback.objects.filter(commission=commission, reason__icontains='adviser').exists():
        Clawback.objects.create(
            commission=commission,
            amount=-commission.adviser_fee_amount,
            reason=f"Clawback of adviser fee for cancelled policy {policy.policy_number}."
        )

    # 2. Create clawbacks for any override commissions
    overrides = Override.objects.filter(commission=commission)
    for override in overrides:
        if not Clawback.objects.filter(commission=commission, reason__icontains=f'override for {override.recipient}').exists():
            Clawback.objects.create(
                commission=commission,
                amount=-override.amount,
                reason=f"Clawback of override for {override.recipient} due to policy cancellation."
            )

    # 3. Update the main commission status
    if commission.payment_status != Commission.PaymentStatus.CLAWBACK:
        commission.payment_status = Commission.PaymentStatus.CLAWBACK
        commission.save()

