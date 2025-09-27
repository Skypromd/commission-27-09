from decimal import Decimal
from django.db.models import Sum
from django.utils import timezone
from .models import Deal, Commission, CommissionBonus

# Определяем константы для KPI
PERFORMANCE_KPI_THRESHOLD = Decimal('20000.00')  # Порог продаж в месяц
PERFORMANCE_BONUS_RATE = Decimal('0.05')       # 5% бонус от базовой комиссии

# Определяем константы для продуктовых модификаторов
PRODUCT_MODIFIER_CATEGORIES = ['Инвестиции']     # Категории для бонуса
PRODUCT_MODIFIER_BONUS_RATE = Decimal('0.02')  # 2% дополнительный бонус

def calculate_commission_amount(deal: Deal) -> Decimal:
    """
    Основной движок расчета комиссий.
    Рассчитывает базовую комиссию и триггерит расчет всех бонусов.
    """
    # TODO: Сделать этот движок более сложным, учитывая правила из CommissionRuleSet

    base_commission = deal.base_amount * (deal.commission_rate / Decimal('100.0'))

    # Пример расширения: бонус для VIP-клиентов (включается в основную комиссию)
    vip_bonus = Decimal('0')
    if deal.client and deal.client.is_vip:
        vip_bonus = base_commission * Decimal('0.1')  # +10% для VIP

    direct_commission = base_commission + vip_bonus

    # Сохраняем или обновляем основную, прямую комиссию
    commission, created = Commission.objects.update_or_create(
        deal=deal,
        defaults={
            'user': deal.user,
            'amount': direct_commission,
            'status': Commission.Status.PENDING,  # Ожидает подтверждения
        }
    )

    # --- РАСЧЕТ И СОЗДАНИЕ ОТДЕЛЬНЫХ БОНУСОВ ---
    # 1. Бонус руководителю
    _calculate_hierarchical_bonus(deal, base_commission)
    # 2. Бонус за производительность
    _calculate_performance_bonus(deal, base_commission)
    # 3. Бонус за категорию продукта
    _calculate_product_modifier_bonus(deal, base_commission)

    return direct_commission


def _calculate_hierarchical_bonus(deal: Deal, base_commission_amount: Decimal):
    """
    Начисляет бонус руководителю сотрудника, закрывшего сделку.
    """
    if not deal.user:
        return

    manager = deal.user.get_parent()
    if manager:
        bonus_rate = Decimal('0.10')  # 10% бонус для руководителя
        bonus_amount = base_commission_amount * bonus_rate

        CommissionBonus.objects.update_or_create(
            deal=deal,
            user=manager,
            bonus_type='hierarchical',
            defaults={
                'bonus_amount': bonus_amount,
                'qualified': True,
            }
        )

def _calculate_performance_bonus(deal: Deal, base_commission_amount: Decimal):
    """
    Начисляет бонус за производительность, если сотрудник выполнил KPI по продажам за месяц.
    """
    user = deal.user
    if not user:
        return

    # Получаем начало и конец текущего месяца для сделки
    deal_date = deal.created_at.date() if deal.created_at else timezone.now().date()
    start_of_month = deal_date.replace(day=1)

    # Считаем сумму всех сделок пользователя за этот месяц (включая текущую)
    monthly_sales = Deal.objects.filter(
        user=user,
        created_at__date__gte=start_of_month,
        created_at__date__lte=deal_date
    ).exclude(pk=deal.pk).aggregate(total=Sum('base_amount'))['total'] or Decimal('0')

    # Проверяем, выполнен ли KPI с учетом текущей сделки
    if (monthly_sales + deal.base_amount) >= PERFORMANCE_KPI_THRESHOLD:
        bonus_amount = base_commission_amount * PERFORMANCE_BONUS_RATE

        CommissionBonus.objects.update_or_create(
            deal=deal,
            user=user,  # Бонус начисляется самому сотруднику
            bonus_type='performance',
            defaults={
                'bonus_amount': bonus_amount,
                'qualified': True,
            }
        )

def _calculate_product_modifier_bonus(deal: Deal, base_commission_amount: Decimal):
    """
    Начисляет бонус за продажу продукта из приоритетной категории.
    """
    product = deal.product
    if not product or not product.category:
        return

    if product.category.name in PRODUCT_MODIFIER_CATEGORIES:
        bonus_amount = base_commission_amount * PRODUCT_MODIFIER_BONUS_RATE

        CommissionBonus.objects.update_or_create(
            deal=deal,
            user=deal.user, # Бонус начисляется самому сотруднику
            bonus_type='product_modifier',
            defaults={
                'bonus_amount': bonus_amount,
                'qualified': True,
            }
        )
