from rest_framework import serializers
from .models import Client, Adviser
from django.contrib.auth.models import User
from django.db import transaction

class ClientSerializer(serializers.ModelSerializer):
    """
    Полный сериализатор для модели Client, включающий все поля из мастер-плана.
    """
    class Meta:
        model = Client
        fields = '__all__'

class ClientComplianceSerializer(serializers.ModelSerializer):
    """
    Легкове��ный сериализатор для отчета по комплаенсу.
    Включает только поля, необходимые для проверки комплаенс-статуса.
    """
    class Meta:
        model = Client
        fields = [
            'id', 'name', 'client_id', 'risk_category',
            'gdpr_consent_status', 'marketing_consent_flag',
            'client_complaint_flag', 'client_complaint_details'
        ]

class AdviserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Adviser.
    """
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name', allow_blank=True, required=False)
    last_name = serializers.CharField(source='user.last_name', allow_blank=True, required=False)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    manager_name = serializers.CharField(source='manager.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Adviser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'full_name',
            'adviser_id', 'fca_reference_number',
            'status', 'club', 'agency_number', 'region', 'contact_details',
            'license_number', 'hierarchy_level', 'role_type', 'active_flag',
            'start_date', 'termination_date', 'aml_check_status',
            'manager', 'manager_name', 'role'
        ]
        read_only_fields = ('is_staff', 'full_name', 'manager_name')

    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user', {})
        password = user_data.pop('password', User.objects.make_random_password())
        user = User.objects.create_user(**user_data, password=password)

        adviser = Adviser.objects.create(user=user, **validated_data)
        return adviser

    @transaction.atomic
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Обновляем поля User
        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        # Обновляем поля Adviser
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
