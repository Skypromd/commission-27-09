import io
from decimal import Decimal
from unittest.mock import patch
from django.core.management import call_command
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.advisers.models import Adviser
from apps.commission.models import Commission, Advance, Retention
from apps.policies.models import Policy

User = get_user_model()

class BaseCommissionTest(TestCase):
    """Базовый класс с общими данными для тестов комиссий."""
    @classmethod
    def setUpTestData(cls):
        # Пользователи
        cls.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        cls.manager_user = User.objects.create_user('manager', 'manager@test.com', 'password')
        cls.adviser1_user = User.objects.create_user('adviser1', 'adviser1@test.com', 'password')
        cls.adviser2_user = User.objects.create_user('adviser2', 'adviser2@test.com', 'password')

        # Профили консультантов
        cls.manager = Adviser.objects.create(user=cls.manager_user, fee_percentage=100, start_date='2023-01-01')
        cls.adviser1 = Adviser.objects.create(user=cls.adviser1_user, parent_adviser=cls.manager, fee_percentage=80, start_date='2023-01-01')
        cls.adviser2 = Adviser.objects.create(user=cls.adviser2_user, fee_percentage=80, start_date='2023-01-01')

        # Полисы и Комиссии
        policy1 = Policy.objects.create(policy_number='P001', adviser=cls.adviser1, provider='A', date_issued='2023-01-01')
        cls.commission1 = Commission.objects.create(policy=policy1, adviser=cls.adviser1, net_commission=1000, date_received='2023-01-01')

        policy2 = Policy.objects.create(policy_number='P002', adviser=cls.adviser2, provider='B', date_issued='2023-01-01')
        cls.commission2 = Commission.objects.create(policy=policy2, adviser=cls.adviser2, net_commission=2000, date_received='2023-01-01')

        # Авансы и Удержания для adviser1
        cls.advance = Advance.objects.create(adviser=cls.adviser1, amount=500, date_issued='2023-02-01')
        cls.retention = Retention.objects.create(commission=cls.commission1, amount=100)

        cls.client = APIClient()


class IngestionCommandTest(TestCase):
    """Тесты для команды импорта ingestion."""

    def setUp(self):
        """Создаем начальные данные для тестов."""
        self.user = User.objects.create_user(
            username='test_adviser',
            password='password123',
            first_name='Test',
            last_name='Adviser'
        )
        self.adviser = Adviser.objects.create(
            user=self.user,
            fee_percentage=Decimal('80.00'),
            start_date='2023-01-01'
        )

    @patch("builtins.open")
    def test_ingestion_command_creates_objects(self, mock_open):
        """Проверяем, ��то команда корректно создает Policy и Commission."""
        # 1. Готовим тестовые данные в формате CSV
        csv_data = (
            "policy_number,adviser_username,product_name,provider,gross_commission,net_commission,date_received\n"
            "POL-001,test_adviser,Test Product,Test Provider,1000.00,800.00,2023-10-26"
        )
        # Оборачиваем их в StringIO, чтобы имитировать файл
        mock_file = io.StringIO(csv_data)
        mock_open.return_value = mock_file

        # 2. Вызываем команду импорта
        call_command('ingestion')

        # 3. Проверяем результат
        self.assertEqual(Policy.objects.count(), 1)
        self.assertEqual(Commission.objects.count(), 1)

        policy = Policy.objects.first()
        self.assertEqual(policy.policy_number, 'POL-001')
        self.assertEqual(policy.adviser, self.adviser)

        commission = Commission.objects.first()
        self.assertEqual(commission.policy, policy)
        self.assertEqual(commission.net_commission, Decimal('800.00'))
        # Проверяем, что вознаграждение рассчиталось правильно (800 * 80% = 640)
        self.assertEqual(commission.adviser_fee_amount, Decimal('640.00'))

        # 4. Проверяем идемпотентность (повторный запуск не создает дубликатов)
        # Сбр��сываем "указат��ль" в файле
        mock_file.seek(0)
        call_command('ingestion')
        self.assertEqual(Policy.objects.count(), 1)
        self.assertEqual(Commission.objects.count(), 1)


class CommissionAPITest(BaseCommissionTest):
    """Тесты для API-эндпоинтов приложения commission."""

    def setUp(self):
        self.client.force_authenticate(user=self.admin_user)

    def test_commission_list_endpoint(self):
        """Проверяем эндпоинт списка комиссий."""
        response = self.client.get('/api/commissions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) # Admin sees all

    def test_commission_statistics_endpoint(self):
        """Проверяем эндпоинт статистики."""
        response = self.client.get('/api/statistics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Admin sees stats for all commissions (1000 + 2000)
        self.assertEqual(response.data['total_net_commission'], Decimal('3000.00'))
        # 1000*80% + 2000*80% = 800 + 1600 = 2400
        self.assertEqual(response.data['total_adviser_payout'], Decimal('2400.00'))
        self.assertEqual(response.data['transaction_count'], 2)

    def test_commission_calculator_endpoint(self):
        """Проверяем калькулятор комиссий, включая оверрайды."""
        data = {
            "net_commission": "1000.00",
            "adviser_id": self.adviser1.id
        }
        response = self.client.post('/api/commission-calculator/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        breakdown = response.data['payout_breakdown']
        self.assertEqual(len(breakdown), 2) # Прямая + Оверрайд

        # Проверяем прямое вознаграждение
        self.assertEqual(breakdown[0]['type'], 'DIRECT')
        self.assertEqual(Decimal(breakdown[0]['calculated_fee']), Decimal('800.00')) # 1000 * 80%

        # Проверяем оверрайд
        self.assertEqual(breakdown[1]['type'], 'OVERRIDE')
        self.assertEqual(Decimal(breakdown[1]['calculated_fee']), Decimal('200.00')) # 1000 * (100% - 80%)

class CommissionAccessTest(BaseCommissionTest):
    """Тесты для проверки прав доступа к API комиссий."""

    def test_adviser_access(self):
        """Консультант видит только свои комиссии."""
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.get('/api/commissions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.commission1.id)

    def test_manager_access(self):
        """Менеджер видит комиссии своих подчиненных, но не чужих."""
        self.client.force_authenticate(user=self.manager_user)
        response = self.client.get('/api/commissions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # Только комиссия подчиненного adviser1
        self.assertEqual(response.data[0]['id'], self.commission1.id)

    def test_admin_access(self):
        """Администратор видит все комиссии."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/commissions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_statistics_for_adviser(self):
        """Статистика для консультанта считается только по его комиссиям."""
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.get('/api/statistics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_net_commission'], self.commission1.net_commission)

    def test_statistics_for_manager(self):
        """Статистика для менеджера считается по комиссиям его команды."""
        self.client.force_authenticate(user=self.manager_user)
        response = self.client.get('/api/statistics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_net_commission'], self.commission1.net_commission)

    def test_my_profile_endpoint(self):
        """Проверяем эндпоинт персонального кабинета."""
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.get('/api/my-profile/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Проверяем наличие всех ключей
        self.assertIn('profile', response.data)
        self.assertIn('statistics', response.data)
        self.assertIn('recent_commissions', response.data)
        self.assertIn('financial_summary', response.data)

        # Проверяем данные профиля
        self.assertEqual(response.data['profile']['id'], self.adviser1.id)

        # Проверяем данные статистики
        self.assertEqual(response.data['statistics']['transaction_count'], 1)
        self.assertEqual(Decimal(response.data['statistics']['total_net_commission']), self.commission1.net_commission)

        # Проверяем последние комиссии
        self.assertEqual(len(response.data['recent_commissions']), 1)
        self.assertEqual(response.data['recent_commissions'][0]['id'], self.commission1.id)

        # Проверяем финансовую сводку
        summary = response.data['financial_summary']
        self.assertEqual(Decimal(summary['outstanding_advances']), self.advance.amount)
        self.assertEqual(Decimal(summary['total_retentions']), self.retention.amount)
