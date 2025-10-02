from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.core import mail

from core.models import Adviser, Client
from apps.insurances.models import Insurer, Policy
from apps.insurances.tasks import send_policy_renewal_reminders

class InsuranceTasksTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testadviser', email='adviser@example.com', password='password')
        self.adviser = Adviser.objects.create(user=self.user)
        self.client = Client.objects.create(name="Test Client")
        self.insurer = Insurer.objects.create(name="Test Insurer")
        self.today = timezone.now().date()

    def test_send_policy_renewal_reminders(self):
        # 1. Policy that needs a reminder
        Policy.objects.create(
            policy_number="RENEW-01", client=self.client, adviser=self.adviser, insurer=self.insurer,
            status=Policy.Status.ACTIVE, renewal_date=self.today + timedelta(days=20)
        )
        # 2. Policy that is too far in the future
        Policy.objects.create(
            policy_number="RENEW-02", client=self.client, adviser=self.adviser, insurer=self.insurer,
            status=Policy.Status.ACTIVE, renewal_date=self.today + timedelta(days=40)
        )
        # 3. Policy that is not active
        Policy.objects.create(
            policy_number="RENEW-03", client=self.client, adviser=self.adviser, insurer=self.insurer,
            status=Policy.Status.PENDING, renewal_date=self.today + timedelta(days=20)
        )
        # 4. Policy for which reminder was already sent
        Policy.objects.create(
            policy_number="RENEW-04", client=self.client, adviser=self.adviser, insurer=self.insurer,
            status=Policy.Status.ACTIVE, renewal_date=self.today + timedelta(days=20),
            renewal_reminder_sent=True
        )

        # Execute the task
        result = send_policy_renewal_reminders.now()

        # Check results
        self.assertEqual(result, "Sent 1 policy renewal reminders.")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Policy Renewal Reminder", mail.outbox[0].subject)
        self.assertIn("RENEW-01", mail.outbox[0].body)

        # Verify the policy was updated
        policy1 = Policy.objects.get(policy_number="RENEW-01")
        self.assertTrue(policy1.renewal_reminder_sent)
        self.assertEqual(policy1.renewal_reminder_date, self.today)

