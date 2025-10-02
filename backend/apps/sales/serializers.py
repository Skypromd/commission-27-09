from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    adviser_name = serializers.CharField(source='adviser.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'date_of_birth', 'address', 'nationality', 'employment_status',
            'risk_category', 'corporate_client_flag', 'client_group_id',
            'client_lifetime_value', 'client_satisfaction_score',
            'marketing_source', 'gdpr_consent_status', 'marketing_consent_flag',
            'adviser', # Writable ID
            'adviser_name' # Read-only name
        ]
        read_only_fields = ['id']
