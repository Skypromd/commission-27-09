from rest_framework import serializers

from .models import (
    Commission, CommissionModifier, MortgageCase, BrokerFee, Lender,
    MortgageRetention, MortgageClawback, MortgageBonus,
    MortgageOverride, MortgageReferralFee, MortgageIngestionTask
)
from apps.clients.serializers import ClientSerializer


class CommissionModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionModifier
        fields = "__all__"


class BrokerFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrokerFee
        fields = "__all__"


class CommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission
        fields = '__all__'


class LenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lender
        fields = '__all__'


class MortgageCaseListSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField()
    lender = serializers.StringRelatedField()
    adviser = serializers.StringRelatedField()

    class Meta:
        model = MortgageCase
        fields = ('id', 'case_number', 'client', 'lender', 'adviser', 'status', 'loan_amount', 'completion_date')


class MortgageCaseDetailSerializer(serializers.ModelSerializer):
    commission = CommissionSerializer(read_only=True)
    broker_fees = BrokerFeeSerializer(many=True, read_only=True)
    client = ClientSerializer(read_only=True)
    lender = LenderSerializer(read_only=True)
    adviser = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = MortgageCase
        fields = "__all__"


class MortgageCaseCancelSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=500)


class MortgageRetentionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageRetention
        fields = '__all__'

class MortgageClawbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageClawback
        fields = '__all__'

class MortgageBonusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageBonus
        fields = '__all__'

class MortgageOverrideSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageOverride
        fields = '__all__'

class MortgageReferralFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageReferralFee
        fields = '__all__'


class MortgageCommissionDataIngestionSerializer(serializers.Serializer):
    commission_data = serializers.ListField(
        child=serializers.DictField()
    )

class MortgageIngestionTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageIngestionTask
        fields = '__all__'
