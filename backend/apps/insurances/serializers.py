from rest_framework import serializers
from .models import (
    Policy,
    Insurer,
    InsuranceType,
    Commission,
    Retention,
    Clawback,
    Bonus,
    Override,
    ReferralFee,
    InsuranceIngestionTask,
)
from django.utils import timezone
# Импортируем общие сериализаторы из core
from apps.core.serializers import ClientSerializer, AdviserSerializer


class InsurerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insurer
        fields = ['id', 'name', 'contact_details', 'fca_reference_number', 'region']

class InsuranceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceType
        fields = ['id', 'name', 'description', 'default_gross_commission_rate', 'default_net_rate']

# --- Modifier Serializers ---
class RetentionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retention
        fields = ['id', 'commission', 'amount', 'reason', 'status', 'created_at', 'is_released', 'release_date', 'retention_period']
        read_only_fields = ('is_released', 'release_date', 'commission', 'status')

class ClawbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clawback
        fields = [
            'id', 'commission', 'amount', 'reason', 'status', 'created_at',
            'clawback_period', 'chargeback_amount', 'chargeback_reason',
            'write_off_amount', 'write_off_reason', 'write_off_date'
        ]
        read_only_fields = ('status', 'commission')

class BonusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bonus
        fields = ['id', 'commission', 'amount', 'reason', 'status', 'created_at', 'kpi_type', 'kpi_achieved']
        read_only_fields = ('commission',)

class OverrideSerializer(serializers.ModelSerializer):
    recipient_name = serializers.CharField(source='recipient.user.get_full_name', read_only=True, allow_null=True)
    class Meta:
        model = Override
        fields = ['id', 'commission', 'amount', 'reason', 'status', 'created_at', 'recipient', 'recipient_name']
        read_only_fields = ('commission',)

class ReferralFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralFee
        fields = '__all__'

class InsuranceCommissionDataIngestionSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        # Здесь можно добавить валидацию на размер файла, тип и т.д.
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError("Поддерживаются только файлы формата CSV.")
        return value

class InsuranceIngestionTaskSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()
    class Meta:
        model = InsuranceIngestionTask
        fields = ['id', 'status', 'created_at', 'created_by', 'result']
        read_only_fields = fields


# --- Main Serializers ---
class CommissionSerializer(serializers.ModelSerializer):
    policy_number = serializers.CharField(source='policy.policy_number', read_only=True)
    adviser_name = serializers.CharField(source='policy.adviser.user.get_full_name', read_only=True)
    retention_set = RetentionSerializer(many=True, read_only=True)
    clawback_set = ClawbackSerializer(many=True, read_only=True)
    bonus_set = BonusSerializer(many=True, read_only=True)
    override_set = OverrideSerializer(many=True, read_only=True)
    referralfee_set = ReferralFeeSerializer(many=True, read_only=True)
    final_payout_to_adviser = serializers.SerializerMethodField()

    class Meta:
        model = Commission
        fields = [
            'id', 'policy', 'policy_number', 'adviser_name', 'gross_commission', 'net_commission',
            'adviser_fee_percentage', 'adviser_fee_amount', 'payment_status',
            'date_received', 'date_paid_to_adviser', 'vat_included', 'commission_invoice_number',
            'commission_due_date', 'currency_code', 'payment_method', 'payment_reference',
            'payment_attachment_links', 'forecasted_commission', 'integration_id',
            'retention_set', 'clawback_set', 'bonus_set', 'override_set', 'referralfee_set',
            'final_payout_to_adviser'
        ]

    def get_final_payout_to_adviser(self, obj):
        total_payout = obj.adviser_fee_amount
        for retention in obj.retention_set.all(): total_payout -= retention.amount
        for clawback in obj.clawback_set.all(): total_payout += clawback.amount
        for bonus in obj.bonus_set.all(): total_payout += bonus.amount
        return total_payout

class PolicyListSerializer(serializers.ModelSerializer):
    """
    A simplified serializer for listing policies, optimized for performance.
    """
    adviser_name = serializers.CharField(source='adviser.user.get_full_name', read_only=True)
    client_name = serializers.CharField(source='client.__str__', read_only=True)
    insurer_name = serializers.CharField(source='insurer.name', read_only=True)
    insurance_type_name = serializers.CharField(source='insurance_type.name', read_only=True)
    commission_status = serializers.CharField(source='commission.payment_status', read_only=True, allow_null=True)
    gross_commission = serializers.DecimalField(source='commission.gross_commission', max_digits=10, decimal_places=2, read_only=True, allow_null=True)

    class Meta:
        model = Policy
        fields = [
            'id', 'policy_number', 'status', 'start_date', 'renewal_date', 'annual_premium_value',
            'adviser_name', 'client_name', 'insurer_name', 'insurance_type_name',
            'commission_status', 'gross_commission'
        ]

class PolicyWriteSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating policies."""
    adviser_id = serializers.PrimaryKeyRelatedField(
        queryset=Adviser.objects.all(), source='adviser', required=False, allow_null=True
    )
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client'
    )
    insurer_id = serializers.PrimaryKeyRelatedField(
        queryset=Insurer.objects.all(), source='insurer'
    )
    insurance_type_id = serializers.PrimaryKeyRelatedField(
        queryset=InsuranceType.objects.all(), source='insurance_type'
    )

    class Meta:
        model = Policy
        fields = [
            'policy_number', 'status', 'start_date', 'end_date', 'renewal_date',
            'coverage_amount', 'monthly_premium', 'policy_currency_code',
            'commission_data', 'policy_document_links', 'digital_signature_status',
            'client_source', 'risk_score', 'cross_sell_opportunity', 'upsell_opportunity',
            'client_complaint_flag', 'client_complaint_details', 'policy_amendment_flag', 'policy_amendment_details',
            'legacy_policy_flag', 'legacy_policy_notes', 'integration_id',
            'adviser_id', 'client_id', 'insurer_id', 'insurance_type_id'
        ]

    def validate_start_date(self, value):
        """
        Проверяем, что дата начала полиса не в прошлом (при создании).
        """
        if self.instance is None and value < timezone.now().date():
            raise serializers.ValidationError("Нельзя создать полис с датой начала в прошлом.")
        return value

class PolicyDetailSerializer(serializers.ModelSerializer):
    adviser = AdviserSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    insurer = InsurerSerializer(read_only=True)
    insurance_type = InsuranceTypeSerializer(read_only=True)
    commission = CommissionSerializer(read_only=True)

    class Meta:
        model = Policy
        fields = [
            'id', 'policy_number', 'status', 'start_date', 'end_date', 'renewal_date',
            'coverage_amount', 'monthly_premium', 'annual_premium_value', 'policy_currency_code',
            'commission_data', 'policy_document_links', 'digital_signature_status',
            'client_source', 'risk_score', 'cross_sell_opportunity', 'upsell_opportunity',
            'client_complaint_flag', 'client_complaint_details', 'policy_amendment_flag', 'policy_amendment_details',
            'policy_cancellation_date', 'policy_cancellation_reason',
            'renewal_reminder_sent', 'renewal_reminder_date',
            'legacy_policy_flag', 'legacy_policy_notes', 'integration_id',
            'adviser', 'client', 'insurer', 'insurance_type',
            'commission'
        ]
