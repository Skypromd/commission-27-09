from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
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


class UserRegistrationSerializer(serializers.Serializer):
    """Сериализатор для регистрации пользователя."""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


class UserLoginSerializer(serializers.Serializer):
    """Сериализатор для входа пользователя."""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
