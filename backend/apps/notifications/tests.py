from datetime import timedelta
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from apps.mortgage.models import MortgageCase
from .models import Notification
from .tasks import check_expiring_mortgages

User = get_user_model()


class NotificationTaskTests(TestCase):
    def setUp(self):
        self.adviser = User.objects.create_user(
            username="adviser", password="testpassword"
        )
        self.borrower = User.objects.create_user(
            username="borrower", password="testpassword"
        )

    def test_check_expiring_mortgages_task(self):
        """
        Проверяем, что задача создает уведомления для ипотек с истекающим сроком.
        """
        # 1. Ипотека, истекающая через 60 дней (должно быть уведомление)
        expiring_case = MortgageCase.objects.create(
            borrower=self.borrower,
            loan_officer=self.adviser,
            status=MortgageCase.Status.CLOSED,
            closing_date=timezone.now().date() + timedelta(days=60),
        )

        # 2. Ипотека, истекающая через 120 дней (не должно быть уведомления)
        MortgageCase.objects.create(
            borrower=self.borrower,
            loan_officer=self.adviser,
            status=MortgageCase.Status.CLOSED,
            closing_date=timezone.now().date() + timedelta(days=120),
        )

        # 3. Ипотека со статусом "в работе" (не должно быть уведомления)
        MortgageCase.objects.create(
            borrower=self.borrower,
            loan_officer=self.adviser,
            status=MortgageCase.Status.IN_PROGRESS,
            closing_date=timezone.now().date() + timedelta(days=30),
        )

        # Запускаем задачу
        result = check_expiring_mortgages()

        self.assertEqual(result, "Проверено 1 истекающих ипотек.")

        # Проверяем, что уведомление было создано
        notifications = Notification.objects.filter(user=self.adviser)
        self.assertEqual(notifications.count(), 1)

        notification = notifications.first()
        self.assertIn("истекает", notification.message)
        self.assertEqual(notification.content_object, expiring_case)

