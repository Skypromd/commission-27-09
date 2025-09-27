from rest_framework import serializers
from .models import Policy

class PolicySerializer(serializers.ModelSerializer):
    """Сериализатор для модели Policy."""
    class Meta:
        model = Policy
        fields = '__all__'

