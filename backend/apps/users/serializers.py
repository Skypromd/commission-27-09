from rest_framework import serializers
from .models import User

class UserProfileSerializer(serializers.ModelSerializer):
    """Сериализатор для профиля текущего пользователя (/me)."""
    manager_username = serializers.CharField(source='manager.username', read_only=True)
    subordinates = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email',
            'manager', 'manager_username', 'subordinates'
        )
        read_only_fields = ('manager', 'manager_username', 'subordinates')


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели пользователя."""
    manager_username = serializers.CharField(source='manager.username', read_only=True)
    subordinates = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email',
            'manager', 'manager_username', 'subordinates'
        )
