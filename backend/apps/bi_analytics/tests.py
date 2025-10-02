from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from decimal import Decimal
from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.advisers.models import Adviser
from apps.commission.models import Commission
from apps.policies.models import Policy
from apps.products.models import Product

User = get_user_model()


class BIAnalyticsTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # 1. Создаем пользователей и консультантов
        cls.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        cls.user1 = User.objects.create_user(username="testuser1", password="password")
        cls.adviser1 = Adviser.objects.create(user=cls.user1, fee_percentage=80, start_date=date(2023, 1, 1))

        cls.user2 = User.objects.create_user(username="testuser2", password="password")
        cls.adviser2 = Adviser.objects.create(user=cls.user2, fee_percentage=80, start_date=date(2023, 1, 1))

        # 2. Создаем продукты
        product_a = Product.objects.create(name="Product A")

        # 3. Создаем данные для тестов
        today = timezone.now().date()
        last_month_date = today.replace(day=1) - timedelta(days=1)

        # Данные за текущий месяц
        policy_current = Policy.objects.create(
            policy_number="POL-001", adviser=cls.adviser1, provider="Provider X", date_issued=today
        )
        Commission.objects.create(
            policy=policy_current, product=product_a, adviser=cls.adviser1,
            gross_commission=Decimal("1000.00"), net_commission=Decimal("800.00"), date_received=today
        )

        # Данные за прошлый месяц
        policy_last1 = Policy.objects.create(
            policy_number="POL-002", adviser=cls.adviser2, provider="Provider Y", date_issued=last_month_date
        )
        Commission.objects.create(
            policy=policy_last1, product=product_a, adviser=cls.adviser2,
            gross_commission=Decimal("2000.00"), net_commission=Decimal("1600.00"), date_received=last_month_date
        )

        policy_last2 = Policy.objects.create(
            policy_number="POL-003", adviser=cls.adviser1, provider="Provider X", date_issued=last_month_date
        )
        Commission.objects.create(
            policy=policy_last2, product=product_a, adviser=cls.adviser1,
            gross_commission=Decimal("500.00"), net_commission=Decimal("400.00"), date_received=last_month_date
        )

    def setUp(self):
        # Логинимся как администратор для доступа к BI эндпоинтам
        self.client.force_authenticate(user=self.admin_user)

    def test_monthly_commission_volume(self):
        """Тестирует агрегацию комиссий по месяцам."""
        url = reverse("bi_analytics:monthly-commission-volume")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # Проверяем сумму за прошлый месяц (2000 + 500)
        self.assertEqual(Decimal(response.data[0]["total_commission"]), Decimal("2500.00"))
        # Проверяем сумму за текущий месяц
        self.assertEqual(Decimal(response.data[1]["total_commission"]), Decimal("1000.00"))

    def test_commission_by_provider(self):
        """Тестирует агрегацию комиссий по страховым компаниям."""
        url = reverse("bi_analytics:commission-by-provider")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        provider_y_data = next(item for item in response.data if item['policy__provider'] == 'Provider Y')
        provider_x_data = next(item for item in response.data if item['policy__provider'] == 'Provider X')
        self.assertEqual(Decimal(provider_y_data["total_commission"]), Decimal("2000.00"))
        self.assertEqual(Decimal(provider_x_data["total_commission"]), Decimal("1500.00")) # 1000 + 500

    def test_top_performers(self):
        """Тестирует рейтинг лучших консультантов."""
        url = reverse("bi_analytics:top-performers")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # adviser2 (2000) должен быть первым
        self.assertEqual(response.data[0]['adviser__user__username'], 'testuser2')
        self.assertEqual(Decimal(response.data[0]['total_commission']), Decimal("2000.00"))
        # adviser1 (1000 + 500) должен быть вторым
        self.assertEqual(response.data[1]['adviser__user__username'], 'testuser1')
        self.assertEqual(Decimal(response.data[1]['total_commission']), Decimal("1500.00"))
