from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.clients.models import Client
from apps.insurance.models import Policy
from apps.mortgage.models import MortgageCase, Lender

User = get_user_model()


class ClientViewSetTests(APITestCase):
    def setUp(self):
        self.manager = User.objects.create_user(username="manager", password="password", role=User.Role.MANAGER)
        self.adviser1 = User.objects.create_user(username="adviser1", password="password", role=User.Role.ADVISER, parent=self.manager)
        self.adviser2 = User.objects.create_user(username="adviser2", password="password", role=User.Role.ADVISER, parent=self.manager)
        self.lonely_adviser = User.objects.create_user(username="lonely", password="password", role=User.Role.ADVISER)

        # Клиент, связанный с adviser1 через ипотеку
        self.client1 = Client.objects.create(first_name="Mortgage", last_name="Client")
        lender = Lender.objects.create(name="Test Bank")
        MortgageCase.objects.create(client=self.client1, adviser=self.adviser1, lender=lender)

        # Клиент, связанный с adviser2 через полис
        self.client2 = Client.objects.create(first_name="Policy", last_name="Client")
        Policy.objects.create(client=self.client2, adviser=self.adviser2, policy_number="POL123")

        # Клиент, не связанный с иерархией менеджера
        self.client3 = Client.objects.create(first_name="Lonely", last_name="Client")
        Policy.objects.create(client=self.client3, adviser=self.lonely_adviser, policy_number="POL456")

    def test_adviser_sees_only_their_clients(self):
        """Консультант должен видеть только своих клиентов."""
        self.client.login(username="adviser1", password="password")
        response = self.client.get(reverse("clients:client-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.client1.id)

    def test_manager_sees_subordinates_clients(self):
        """Менеджер должен видеть клиентов своих подчиненных."""
        self.client.login(username="manager", password="password")
        response = self.client.get(reverse("clients:client-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        client_ids = {item['id'] for item in response.data}
        self.assertIn(self.client1.id, client_ids)
        self.assertIn(self.client2.id, client_ids)

    def test_superuser_sees_all_clients(self):
        """Суперпользователь должен видеть всех клиентов."""
        superuser = User.objects.create_superuser("superuser", "password")
        self.client.login(username="superuser", password="password")
        response = self.client.get(reverse("clients:client-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

