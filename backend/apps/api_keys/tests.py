from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework.views import APIView

from .authentication import APIKeyAuthentication
from .models import UserAPIKey

User = get_user_model()


class APIKeyAuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.api_key, self.key = UserAPIKey.objects.create_key(
            name="test-key", user=self.user
        )
        self.url = reverse("reports:detailed-report")

    def test_valid_api_key(self):
        """
        Запрос с валидным API-ключом должен быть успешным.
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Api-Key {self.key}")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticate_method_returns_user(self):
        """
        Проверяем, что метод authenticate возвращает пользователя и ключ.
        """
        factory = APIRequestFactory()
        request = factory.get(self.url, HTTP_AUTHORIZATION=f"Api-Key {self.key}")

        auth = APIKeyAuthentication()
        user, key = auth.authenticate(request)

        self.assertIsNotNone(user)
        self.assertEqual(user, self.user)
        self.assertEqual(key, self.api_key)

    def test_invalid_api_key(self):
        """
        Запрос с невалидным API-ключом должен возвращать ошибку 403.
        """
        self.client.credentials(HTTP_AUTHORIZATION="Api-Key invalidkey")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_no_api_key(self):
        """
        Запрос без API-ключа должен возвращать ошибку 403.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_revoked_api_key(self):
        """
        Запрос с отозванным API-ключом должен возвращать ошибку 403.
        """
        self.api_key.revoked = True
        self.api_key.save()
        self.client.credentials(HTTP_AUTHORIZATION=f"Api-Key {self.key}")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
