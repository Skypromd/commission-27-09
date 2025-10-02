"""
[IDE FIX] Ошибки "Unresolved reference"? См. INTERPRETER_SETUP.md в корне пр��екта.
"""
from decimal import Decimal

import pytest
from django.contrib.auth.models import User

from apps.commission.models import Deal
from apps.commission.services import get_deals_summary


@pytest.mark.django_db
def test_get_deals_summary_with_data():
    """
    Проверяет, что сервис правильно рассчитывает статистику при наличии данных.
    """
    user = User.objects.create_user(username="testuser")
    Deal.objects.create(
        user=user, title="Deal 1", amount=Decimal("1000"), commission_rate=Decimal("10")
    )  # Commission: 100
    Deal.objects.create(
        user=user, title="Deal 2", amount=Decimal("500"), commission_rate=Decimal("5")
    )  # Commission: 25

    queryset = Deal.objects.filter(user=user)
    summary = get_deals_summary(queryset)

    assert summary["total_deals"] == 2
    assert summary["total_amount"] == Decimal("1500")
    assert summary["total_commission"] == Decimal("125")


@pytest.mark.django_db
def test_get_deals_summary_empty_queryset():
    """
    Проверяет, что сервис возвращает нули для пустого набора данных.
    """
    user = User.objects.create_user(username="testuser")
    queryset = Deal.objects.filter(user=user)
    summary = get_deals_summary(queryset)

    assert summary["total_deals"] == 0
    assert summary["total_amount"] == 0
    assert summary["total_commission"] == 0
