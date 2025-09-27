from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils import timezone
from decimal import Decimal
from django.urls import reverse

from apps.clients.models import Client
from .models import Lender, MortgageCase, Commission, MortgageClawback

User = get_user_model()

class MortgageAPITests(APITestCase):
    def setUp(self):
        self.manager = User.objects.create_user(username='manager', password='password', role=User.Role.MANAGER)
        self.adviser = User.objects.create_user(username='adviser', password='password', role=User.Role.ADVISER, parent=self.manager)

        self.client_obj = Client.objects.create(name='Mortgage Client', agent=self.manager)
        self.lender = Lender.objects.create(name='Mortgage Lender')

        self.case1 = MortgageCase.objects.create(
            case_number='CASE01', adviser=self.manager, client=self.client_obj, lender=self.lender, loan_amount=300000
        )
        self.case2 = MortgageCase.objects.create(
            case_number='CASE02', adviser=self.adviser, client=self.client_obj, lender=self.lender, loan_amount=200000
        )

    def test_manager_can_see_subordinate_cases(self):
        """Проверяем, что менеджер видит свои сделки и сделки подчиненного."""
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(reverse('mortgage:mortgagecase-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_adviser_sees_only_own_cases(self):
        """Проверяем, что подчин��нный консультант видит только свои сделки."""
        self.client.force_authenticate(user=self.adviser)
        response = self.client.get(reverse('mortgage:mortgagecase-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['case_number'], 'CASE02')

    def test_cancel_case_creates_clawback(self):
        """Проверяем, что отмена ипотечной сделки с комиссией создает Clawback."""
        commission = Commission.objects.create(mortgage_case=self.case1, gross_commission=Decimal('3000.00'))
        self.client.force_authenticate(user=self.manager)
        url = reverse('mortgage:mortgagecase-cancel', kwargs={'pk': self.case1.id})
        response = self.client.post(url, {'reason': 'test'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.case1.refresh_from_db()
        self.assertEqual(self.case1.status, 'cancelled')
        self.assertTrue(MortgageClawback.objects.filter(commission=commission).exists())

    def test_adviser_performance_report(self):
        """Проверяем, что отчет по производительности работает корректно."""
        self.client.force_authenticate(user=self.manager)
        url = reverse('mortgage:reporting-adviser-performance')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        # Проверяем данные по менеджеру
        manager_data = next(item for item in response.data if item['adviser__username'] == 'manager')
        self.assertEqual(manager_data['case_count'], 1)
        self.assertEqual(manager_data['total_loan_amount'], 300000)
