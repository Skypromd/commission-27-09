from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from decimal import Decimal

from apps.clients.models import Client
from apps.products.models import ProductCategory, Product
from .models import Policy, Insurer, Commission, Clawback

User = get_user_model()

class InsuranceAPITests(APITestCase):
    def setUp(self):
        self.adviser1 = User.objects.create_user(username='adviser1', password='password', role=User.Role.ADVISER, agency_number='MGR01')
        self.adviser2 = User.objects.create_user(username='adviser2', password='password', role=User.Role.ADVISER, parent_agency_id='MGR01')
        self.adviser3 = User.objects.create_user(username='adviser3', password='password', role=User.Role.ADVISER)

        self.client1 = Client.objects.create(name='Client of Adviser 1', agent=self.adviser1)
        self.insurer = Insurer.objects.create(name="Test Insurer")
        self.product = Product.objects.create(name="Test Insurance")

        self.policy1 = Policy.objects.create(
            policy_number='POL001', adviser=self.adviser1, client=self.client1, insurer=self.insurer,
            insurance_type=self.product, annual_premium_value=1200
        )
        self.policy2 = Policy.objects.create(
            policy_number='POL002', adviser=self.adviser2, client=self.client1, insurer=self.insurer,
            insurance_type=self.product, annual_premium_value=2400
        )

    def test_adviser_cannot_access_others_policy(self):
        """Убедимся, ч��о адвайзер (adviser3) не может получить доступ к чужому полис�� (policy1)."""
        self.client.force_authenticate(user=self.adviser3)
        response = self.client.get(f'/api/insurances/policies/{self.policy1.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_manager_can_see_subordinate_policies(self):
        """Убедимся, что менеджер (adviser1) видит свои по��исы и полисы подчиненных (adviser2)."""
        self.client.force_authenticate(user=self.adviser1)
        response = self.client.get('/api/insurances/policies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_subordinate_sees_only_own_policies(self):
        """Убедимся, что подчиненный (adviser2) видит только ��вои полисы."""
        self.client.force_authenticate(user=self.adviser2)
        response = self.client.get('/api/insurances/policies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['policy_number'], 'POL002')

    def test_cancel_policy_creates_clawback(self):
        """Проверяем, что отмена полиса с комиссией создает Clawback."""
        commission = Commission.objects.create(policy=self.policy1, gross_commission=Decimal('120.00'))
        self.client.force_authenticate(user=self.adviser1)
        url = f'/api/insurances/policies/{self.policy1.id}/cancel/'
        response = self.client.post(url, {'reason': 'test'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Cancelled')
        self.assertTrue(Clawback.objects.filter(commission=commission).exists())
