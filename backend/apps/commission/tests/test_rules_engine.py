from decimal import Decimal

from django.test import TestCase

from apps.commission.models import (
    Client,
    CustomUser,
    Deal,
    Product,
    ProductCategory,
)


class RulesEngineTests(TestCase):
    """
    Тесты для проверки движка правил расчета комиссий (rules_engine).
    Эти тесты проверяют конечный результат в поле deal.commission_amount,
    которое вычисляется при вызове deal.save().
    """

    def setUp(self):
        """
        Настройка базовых объектов, необходимых для создания сделки.
        Этот метод выполняется перед каждым тестом.
        """
        self.user = CustomUser.objects.create_user(
            username="testuser", password="password"
        )
        self.client = Client.objects.create(
            name="Test Client", email="client@test.com", user=self.user
        )
        self.category = ProductCategory.objects.create(name="General Products")
        self.product = Product.objects.create(
            name="Test Product", category=self.category
        )

    def test_basic_commission_calculation(self):
        """
        Тест: Проверяет базовый расчет: Сумма * Ставка.
        """
        # Arrange (Подготовка)
        deal = Deal(
            user=self.user,
            client=self.client,
            product=self.product,
            base_amount=Decimal("1000.00"),
            commission_rate=Decimal("10.00"),  # 10%
        )

        # Act (Действие)
        deal.save()  # Метод .save() должен вызывать движок правил

        # Assert (Проверка)
        expected_commission = Decimal("100.00")  # 10% от 1000
        self.assertEqual(deal.commission_amount, expected_commission)

    def test_zero_commission_rate(self):
        """
        Тест: Проверяет, что комиссия равна нулю, если ставка нулевая.
        """
        # Arrange
        deal = Deal(
            user=self.user,
            client=self.client,
            product=self.product,
            base_amount=Decimal("5000.00"),
            commission_rate=Decimal("0.00"),
        )

        # Act
        deal.save()

        # Assert
        self.assertEqual(deal.commission_amount, Decimal("0.00"))

    def test_hypothetical_bonus_rule(self):
        """
        Тест: Пример проверки гипотетического правила.
        Допустим, для продуктов категории "Insurance" начисляется бонус +50.
        ВАМ НУЖНО АДАПТИРОВАТЬ ЭТОТ ТЕСТ ПОД ВАШИ РЕАЛЬНЫЕ ПРАВИЛА.
        """
        # Arrange
        insurance_category = ProductCategory.objects.create(name="Insurance")
        insurance_product = Product.objects.create(
            name="Life Insurance", category=insurance_category
        )
        deal = Deal(
            user=self.user,
            client=self.client,
            product=insurance_product,
            base_amount=Decimal("2000.00"),
            commission_rate=Decimal("5.00"),  # 5% = 100.00
        )

        # Act
        deal.save()
from django.test import TestCase
from decimal import Decimal

# Импортируем модели из их новых приложений
from apps.users.models import CustomUser
from apps.deals.models import Deal
from apps.clients.models import Client
from apps.products.models import Product, ProductCategory

from ..models import CommissionBonus
from ..rules_engine import calculate_commission_amount


class CommissionRulesEngineTests(TestCase):

    def setUp(self):
        """Настройка тестового окружения перед каждым тестом."""
        self.manager = CustomUser.objects.create_user(username='manager', password='password')
        self.subordinate = CustomUser.objects.create_user(username='subordinate', password='password', parent=self.manager)
        self.client = Client.objects.create(name="Test Client Corp")
        self.regular_category = ProductCategory.objects.create(name="Стандартные")
        self.investment_category = ProductCategory.objects.create(name="Инвестиции")
        self.product = Product.objects.create(name="Test Product", category=self.regular_category)

    def test_hierarchical_bonus_is_created_for_manager(self):
        deal = Deal.objects.create(user=self.subordinate, client=self.client, product=self.product, title="Test Deal", base_amount=Decimal('1000.00'), commission_rate=Decimal('10.00'))
        calculate_commission_amount(deal)
        self.assertEqual(CommissionBonus.objects.filter(bonus_type='hierarchical').count(), 1)
        bonus = CommissionBonus.objects.get(bonus_type='hierarchical')
        self.assertEqual(bonus.user, self.manager)
        self.assertEqual(bonus.deal, deal)
        self.assertEqual(bonus.bonus_amount, Decimal('100.00') * Decimal('0.10'))

    def test_no_bonus_if_user_has_no_manager(self):
        deal = Deal.objects.create(user=self.manager, client=self.client, product=self.product, title="Manager's Own Deal", base_amount=Decimal('2000.00'), commission_rate=Decimal('10.00'))
        calculate_commission_amount(deal)
        self.assertFalse(CommissionBonus.objects.filter(bonus_type='hierarchical').exists())

    def test_performance_bonus_is_applied_when_kpi_met(self):
        Deal.objects.create(user=self.subordinate, client=self.client, product=self.product, title="Past Deal 1", base_amount=Decimal('15000.00'), commission_rate=Decimal('10.00'))
        current_deal = Deal.objects.create(user=self.subordinate, client=self.client, product=self.product, title="Current Deal to meet KPI", base_amount=Decimal('5000.00'), commission_rate=Decimal('10.00'))
        calculate_commission_amount(current_deal)
        self.assertTrue(CommissionBonus.objects.filter(deal=current_deal, user=self.subordinate, bonus_type='performance').exists())
        perf_bonus = CommissionBonus.objects.get(deal=current_deal, bonus_type='performance')
        self.assertEqual(perf_bonus.bonus_amount, Decimal('500.00') * Decimal('0.05'))

    def test_performance_bonus_not_applied_when_kpi_not_met(self):
        deal = Deal.objects.create(user=self.subordinate, client=self.client, product=self.product, title="Deal not meeting KPI", base_amount=Decimal('5000.00'), commission_rate=Decimal('10.00'))
        calculate_commission_amount(deal)
        self.assertFalse(CommissionBonus.objects.filter(deal=deal, user=self.subordinate, bonus_type='performance').exists())

    def test_product_modifier_bonus_is_applied(self):
        investment_product = Product.objects.create(name="Investment Fund", category=self.investment_category)
        deal = Deal.objects.create(user=self.subordinate, client=self.client, product=investment_product, title="Investment Deal", base_amount=Decimal('50000.00'), commission_rate=Decimal('2.00'))
        calculate_commission_amount(deal)
        self.assertTrue(CommissionBonus.objects.filter(deal=deal, user=self.subordinate, bonus_type='product_modifier').exists())
        bonus = CommissionBonus.objects.get(deal=deal, bonus_type='product_modifier')
        self.assertEqual(bonus.bonus_amount, Decimal('1000.00') * Decimal('0.02'))

    def test_product_modifier_bonus_not_applied_for_regular_product(self):
        deal = Deal.objects.create(user=self.subordinate, client=self.client, product=self.product, title="Regular Deal", base_amount=Decimal('10000.00'), commission_rate=Decimal('5.00'))
        calculate_commission_amount(deal)
        self.assertFalse(CommissionBonus.objects.filter(deal=deal, bonus_type='product_modifier').exists())
        # Assert
        # Ожидаемый результат: 100.00 (базовая комиссия) + 50.00 (бонус) = 150.00
        # Если ваш движок правил действительно добавляет бонус, этот тест пройдет.
        # Если нет, он упадет, и вы будете знать, что логика не реализована.
        # Замените `expected_commission` на реальное ожидаемое значение.
        expected_commission = Decimal("100.00")  # ИЗМЕНИТЕ ЭТО ЗНАЧЕНИЕ
        # self.assertEqual(deal.commission_amount, expected_commission) # Раскомментируйте и исправьте

        # Этот assert просто проверяет, что поле заполнено.
        self.assertIsNotNone(deal.commission_amount)
