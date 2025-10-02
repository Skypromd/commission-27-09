from rest_framework import serializers
from .models import Commission, CommissionModifier, Retention, Clawback, Bonus, Override, ReferralFee, CommissionSplit, Advance, Repayment, VestingSchedule, ScheduledPayout
from apps.advisers.serializers import AdviserSerializer
from apps.products.serializers import ProductSerializer
from apps.policies.serializers import PolicySerializer


class CommissionModifierSerializer(serializers.ModelSerializer):
    """Базовый сериализатор для всех модификаторов комиссии."""
    class Meta:
        model = CommissionModifier
        fields = ('id', 'amount', 'reason', 'status', 'created_at')
        read_only_fields = ('id', 'created_at')


class RetentionSerializer(CommissionModifierSerializer):
    class Meta(CommissionModifierSerializer.Meta):
        model = Retention
        fields = CommissionModifierSerializer.Meta.fields + ('is_released', 'release_date', 'retention_period')


class ClawbackSerializer(CommissionModifierSerializer):
    class Meta(CommissionModifierSerializer.Meta):
        model = Clawback
        fields = CommissionModifierSerializer.Meta.fields + ('clawback_period',)


class BonusSerializer(CommissionModifierSerializer):
    class Meta(CommissionModifierSerializer.Meta):
        model = Bonus
        fields = CommissionModifierSerializer.Meta.fields + ('kpi_type', 'kpi_achieved')


class OverrideSerializer(CommissionModifierSerializer):
    recipient = AdviserSerializer(read_only=True)

    class Meta(CommissionModifierSerializer.Meta):
        model = Override
        fields = CommissionModifierSerializer.Meta.fields + ('recipient',)


class ReferralFeeSerializer(CommissionModifierSerializer):
    class Meta(CommissionModifierSerializer.Meta):
        model = ReferralFee
        fields = CommissionModifierSerializer.Meta.fields + ('referral_source_name', 'referral_source_type', 'referral_agreement_id')


class CommissionSerializer(serializers.ModelSerializer):
    """Сериализатор для основной модели Commission с вложенными модификаторами."""
    policy = PolicySerializer(read_only=True)
    adviser = AdviserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    retentions = RetentionSerializer(many=True, read_only=True)
    clawbacks = ClawbackSerializer(many=True, read_only=True)
    bonuses = BonusSerializer(many=True, read_only=True)
    overrides = OverrideSerializer(many=True, read_only=True)
    referralfees = ReferralFeeSerializer(many=True, read_only=True)

    class Meta:
        model = Commission
        fields = (
            'id', 'policy', 'product', 'adviser', 'gross_commission', 'net_commission',
            'adviser_fee_percentage', 'adviser_fee_amount', 'payment_status',
            'date_received', 'retentions', 'clawbacks', 'bonuses', 'overrides', 'referralfees'
        )


# --- Сериализаторы для новых моделей ---
class CommissionSplitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionSplit
        fields = '__all__'

class AdvanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advance
        fields = '__all__'

class RepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = '__all__'

class VestingScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VestingSchedule
        fields = '__all__'

class ScheduledPayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledPayout
        fields = '__all__'
