from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.clients.models import Client
from apps.products.models import Product
from apps.insurances.models import Policy, Insurer, Commission, Override, Clawback
from apps.insurances.services import create_commission_for_policy

User = get_user_model()

class InsuranceServicesTests(TestCase):
    def setUp(self):
        # Создаем менеджера (родительского консультанта)
        self.manager = User.objects.create_user(
            username='manager', 
            password='password', 
            role=User.Role.ADVISER, 
            agency_number='MGR001',
            default_commission_percentage=Decimal('10.00'),
            default_override_percentage=Decimal('5.00') # Процент оверрайда для менеджера
        )

        # Создаем обычного консультанта, подчиненного менеджеру
        self.adviser = User.objects.create_user(
            username='adviser', 
            password='password', 
            role=User.Role.ADVISER, 
            parent_adviser=self.manager, # Указываем менеджера как родителя
            default_commission_percentage=Decimal('50.00') # Процент комиссии для консультанта
        )

        # Создаем клиента
        self.client_obj = Client.objects.create(name='Test Client', agent=self.adviser)

        # Создаем страховщика
        self.insurer = Insurer.objects.create(
            name="Test Insurer", 
            default_gross_commission_rate=Decimal('10.00'), # 10% валовой комиссии
            default_net_rate=Decimal('100.00') # 100% от валовой - нетто
        )

        # Создаем второго страховщика для дополнительных тестов
        self.second_insurer = Insurer.objects.create(
            name="Another Insurer",
            default_gross_commission_rate=Decimal('15.00'), # Другой процент валовой комиссии
            default_net_rate=Decimal('90.00') # Другой процент нетто
        )

        # Создаем продукт (тип страхования)
        self.product = Product.objects.create(
            name="Life Insurance", 
            default_gross_commission_rate=Decimal('12.00'), # 12% валовой комиссии
            default_net_rate=Decimal('100.00') # 100% от валовой - нетто
        )

        # Создаем полис, привязанный к консультанту и имеющий APV
        self.policy = Policy.objects.create(
            policy_number='POL-001-TEST', 
            adviser=self.adviser, 
            client=self.client_obj, 
            insurer=self.insurer,
            insurance_type=self.product, 
            annual_premium_value=Decimal('1000.00') # Годовая премия
        )

    def test_create_commission_for_policy_with_override(self):
        """
        Проверяет, что create_commission_for_policy создает основную комиссию
        и Override комиссию для родительского консультанта.
        """
        # Убедимся, что комиссий и оверрайдов изначально нет
        self.assertEqual(Commission.objects.count(), 0)
        self.assertEqual(Override.objects.count(), 0)

        # Вызываем сервисную функцию
        commission = create_commission_for_policy(self.policy)

        # Проверяем создание основной комиссии
        self.assertIsNotNone(commission)
        self.assertEqual(Commission.objects.count(), 1)
        self.assertEqual(commission.policy, self.policy)

        # Ожидаемый расчет: APV 1000, Gross Rate (из продукта) 12% = 120.00
        # Net Rate 100% от Gross = 120.00
        self.assertEqual(commission.gross_commission, Decimal('120.00'))
        self.assertEqual(commission.net_commission, Decimal('120.00'))
        self.assertEqual(commission.adviser_fee_percentage, self.adviser.default_commission_percentage)

        # Проверяем создание Override комиссии
        self.assertEqual(Override.objects.count(), 1)
        override = Override.objects.first()
        self.assertEqual(override.commission, commission)
        self.assertEqual(override.recipient, self.manager)

        # Ожидаемый расчет Override: net_commission 120.00 * manager.default_override_percentage 5% = 6.00
        self.assertEqual(override.amount, Decimal('6.00'))
        self.assertIn("Override from", override.reason)

    def test_create_commission_for_policy_no_override_without_parent_adviser(self):
        """
        Проверяет, что Override комиссия не создается, если у консультанта нет родителя.
        """
        # Создаем полис с консультантом без родителя
        adviser_no_parent = User.objects.create_user(username='adviser_no_parent', password='password', role=User.Role.ADVISER)
        policy_no_parent = Policy.objects.create(
            policy_number='POL-002-TEST', 
            adviser=adviser_no_parent, 
            client=self.client_obj, 
            insurer=self.insurer,
            insurance_type=self.product, 
            annual_premium_value=Decimal('500.00')
        )

        # Убедимся, что комиссий и оверрайдов изначально нет
        self.assertEqual(Commission.objects.count(), 0)
        self.assertEqual(Override.objects.count(), 0)

        # Вызываем сервисную функцию
        commission = create_commission_for_policy(policy_no_parent)

        # Проверяем создание основной комиссии
        self.assertIsNotNone(commission)
        self.assertEqual(Commission.objects.count(), 1)

        # Проверяем, что Override комиссия не создана
        self.assertEqual(Override.objects.count(), 0)

    def test_create_commission_for_policy_no_apv(self):
        """
        Проверяет, что комиссия не создается, если у полиса нет annual_premium_value.
        """
        policy_no_apv = Policy.objects.create(
            policy_number='POL-003-TEST', 
            adviser=self.adviser, 
            client=self.client_obj, 
            insurer=self.insurer,
            insurance_type=self.product, 
            annual_premium_value=None # Нет APV
        )

        self.assertEqual(Commission.objects.count(), 0)

        commission = create_commission_for_policy(policy_no_apv)

        self.assertIsNone(commission)
        self.assertEqual(Commission.objects.count(), 0)

    def test_create_commission_for_policy_already_exists(self):
        """
        Проверяет, что функция возвращает существующую комиссию, если она уже есть.
        """
        # Создаем комиссию заранее
        Commission.objects.create(policy=self.policy, gross_commission=Decimal('100.00'))

        self.assertEqual(Commission.objects.count(), 1)

        # Пытаемся создать еще раз
        commission = create_commission_for_policy(self.policy)

        self.assertIsNotNone(commission)
        self.assertEqual(Commission.objects.count(), 1) # Количество не должно измениться
        self.assertTrue(hasattr(self.policy, 'commission'))
        self.assertEqual(commission, self.policy.commission)

    def test_handle_policy_cancellation_creates_clawbacks(self):
        """
        Проверяет, что handle_policy_cancellation_service создает Clawbacks
        для основной комиссии и для оверрайда при отмене полиса.
        """
        # Создаем комиссию и оверрайд для полиса перед отменой
        commission = create_commission_for_policy(self.policy)
        self.assertIsNotNone(commission)
        self.assertEqual(Commission.objects.count(), 1)
        self.assertEqual(Override.objects.count(), 1)
        self.assertEqual(Clawback.objects.count(), 0) # Изначально нет клаубэков

        # Вызываем сервисную функцию для отмены полиса
        from apps.insurances.services import handle_policy_cancellation_service
        handle_policy_cancellation_service(self.policy)

        # Проверяем, что создано 2 Clawback (один для основной комиссии, один для оверрайда)
        self.assertEqual(Clawback.objects.count(), 2)

        # Проверяем Clawback для основной комиссии
        adviser_clawback = Clawback.objects.filter(reason__icontains='adviser fee').first()
        self.assertIsNotNone(adviser_clawback)
        self.assertEqual(adviser_clawback.commission, commission)
        # Теперь adviser_fee_amount должен быть вычислен и сохранен
        expected_adviser_clawback_amount = -commission.adviser_fee_amount
        self.assertEqual(adviser_clawback.amount, expected_adviser_clawback_amount)

        # Проверяем Clawback для Override комиссии
        override_clawback = Clawback.objects.filter(reason__icontains='override').first()
        self.assertIsNotNone(override_clawback)
        self.assertEqual(override_clawback.commission, commission)
        self.assertEqual(override_clawback.amount, -commission.override_set.first().amount)

        # Проверяем, что статус основной комиссии изменился на CLAWBACK
        commission.refresh_from_db()
        self.assertEqual(commission.payment_status, Commission.PaymentStatus.CLAWBACK)

    def test_handle_policy_cancellation_no_commission(self):
        """
        Проверяет, что handle_policy_cancellation_service ничего не делает,
        если у полиса нет связанной комиссии.
        """
        self.assertEqual(Clawback.objects.count(), 0)

        from apps.insurances.services import handle_policy_cancellation_service
        handle_policy_cancellation_service(self.policy) # У полиса нет комиссии в setUp

        self.assertEqual(Clawback.objects.count(), 0) # Клабэки не должны быть созданы

    def test_handle_policy_cancellation_idempotence(self):
        """
        Проверяет, что повторный вызов handle_policy_cancellation_service не создает дубликаты Clawbacks.
        """
        commission = create_commission_for_policy(self.policy)
        from apps.insurances.services import handle_policy_cancellation_service

        handle_policy_cancellation_service(self.policy)
        self.assertEqual(Clawback.objects.count(), 2) # Первый вызов

        handle_policy_cancellation_service(self.policy)
        self.assertEqual(Clawback.objects.count(), 2) # Второй вызов не должен добавить новых

        commission.refresh_from_db()
        self.assertEqual(commission.payment_status, Commission.PaymentStatus.CLAWBACK)
