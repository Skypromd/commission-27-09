from rest_framework import serializers
from .models import Deal
from apps.clients.models import Client

class DealSerializer(serializers.ModelSerializer):
    """Сериализатор для модели сделки."""
    agent_username = serializers.CharField(source='agent.username', read_only=True)
    client_name = serializers.CharField(source='client.__str__', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Deal
        fields = (
            'id', 'product', 'product_name', 'client', 'client_name', 'agent',
            'agent_username', 'amount', 'status', 'deal_date'
        )
        read_only_fields = ('agent', 'agent_username', 'client_name', 'product_name', 'deal_date', 'status')

    def validate_client(self, value):
        """
        Проверка, что клиент принадлежит агенту, создающему сделку.
        """
        user = self.context['request'].user
        if not user.is_staff and value.agent != user:
            raise serializers.ValidationError("Вы можете создавать сделки только для своих клиентов.")
        return value
