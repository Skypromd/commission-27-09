from rest_framework_api_key.authentication import APIKeyAuthentication
from .models import UserAPIKey


class UserAPIKeyAuthentication(APIKeyAuthentication):
    """
    Кастомный класс аутентификации, который использует нашу модель UserAPIKey.
    При успешной аутентификации по ключу, `request.user` будет установлен
    в пользователя, связанного с этим ключом.
    """
    model = UserAPIKey

    def authenticate_credentials(self, key: str):
        """
        Переопределяем метод, чтобы он возвращал (user, api_key).
        """
        model = self.get_model()
        try:
            api_key = model.objects.get_from_key(key)
        except model.DoesNotExist:
            return None

        if not api_key.is_valid:
            return None
        
        # Устанавливаем пользователя из ключа
        user = api_key.user
        if not user.is_active:
            return None

        return user, api_key


class APIKeyAuthentication:
    pass