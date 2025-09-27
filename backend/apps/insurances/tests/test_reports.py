from django.utils import timezone
from datetime import date, timedelta
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from apps.core.models import Adviser, Client
from apps.insurances.models import Insurer, Policy, Commission


class ReportAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser('admin_ins', 'admin_ins@test.com', 'password')
        self.admin_token = Token.objects.create(user=self.admin_user)
        self.manager_adviser = Adviser.objects.create(user=self.admin_user)

        self.sub_user = User.objects.create_user('sub_ins', 'sub_ins@test.com', 'password')
        self.sub_adviser = Adviser.objects.create(user=self.sub_user, manager=self.manager_adviser)

        self.insurer1 = Insurer.objects.create(name="Aviva")
        self.insurer2 = Insurer.objects.create(name="AXA")
        self.client_obj = Client.objects.create(name="Report Client")

        # Data for manager (admin) - May
        policy1 = Policy.objects.create(adviser=self.manager_adviser, insurer=self.insurer1, client=self.client_obj, policy_number="INS-01")
        Commission.objects.create(policy=policy1, gross_commission=500, date_received=date(2024, 5, 10))

        # Data for subordinate - May
        policy2 = Policy.objects.create(adviser=self.sub_adviser, insurer=self.insurer2, client=self.client_obj, policy_number="INS-02")
        Commission.objects.create(policy=policy2, gross_commission=1200, date_received=date(2024, 5, 15))

        # Old data for subordinate - April
        policy3 = Policy.objects.create(adviser=self.sub_adviser, insurer=self.insurer1, client=self.client_obj, policy_number="INS-03")
        Commission.objects.create(policy=policy3, gross_commission=300, date_received=date(2024, 4, 20))

        # Cancelled policy - May
        Policy.objects.create(
            adviser=self.sub_adviser, insurer=self.insurer1, client=self.client_obj, policy_number="INS-CANCEL-01",
            status='CANCELLED', cancellation_date=date(2024, 5, 20), premium_amount=100
        )

    def test_report_permissions(self):
        """Ensure only admin users can access reports."""
        user = User.objects.create_user('normaluser', 'user@test.com', 'password')
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        url = reverse('insurances:report-adviser-performance')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_adviser_performance_report_hierarchy_and_date_filter(self):
        """Test that the adviser report respects hierarchy and date filters."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)
        url = reverse('insurances:report-adviser-performance')

        response = self.client.get(url, {'start_date': '2024-05-01', 'end_date': '2024-05-31'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        report_data = {item['adviser_username']: item for item in response.data}

        self.assertEqual(report_data['admin_ins']['policy_count'], 1)
        self.assertEqual(report_data['admin_ins']['total_commission'], 500)
        self.assertEqual(report_data['sub_ins']['policy_count'], 1)
        self.assertEqual(report_data['sub_ins']['total_commission'], 1200)

    def test_commission_by_insurer_report_date_filter(self):
        """Test the commission by insurer report with a date filter."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)
        url = reverse('insurances:report-commission-by-insurer')

        response = self.client.get(url, {'start_date': '2024-04-01', 'end_date': '2024-04-30'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['insurer_name'], 'Aviva')
        self.assertEqual(response.data[0]['total_commission'], 300)

    def test_cancellation_analysis_report(self):
        """Test the cancellation analysis report returns correct data."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)
        url = reverse('insurances:report-cancellation-analysis')
        response = self.client.get(url, {'start_date': '2024-05-01', 'end_date': '2024-05-31'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['insurer_name'], 'Aviva')
        self.assertEqual(response.data[0]['cancelled_count'], 1)
        self.assertEqual(response.data[0]['total_premium'], 100)


class DashboardAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('dash_user_ins', 'dash@test.com', 'password')
        self.adviser = Adviser.objects.create(user=self.user)
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.insurer = Insurer.objects.create(name="Test Insurer")
        self.client_obj = Client.objects.create(name="Dashboard Client")
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        # Policy with commission this month
        policy1 = Policy.objects.create(
            adviser=self.adviser, insurer=self.insurer, client=self.client_obj, policy_number="DASH-01",
            start_date=start_of_month, status='ACTIVE'
        )
        Commission.objects.create(
            policy=policy1, gross_commission=750.00, date_received=today
        )

        # Policy with upcoming renewal
        Policy.objects.create(
            adviser=self.adviser, insurer=self.insurer, client=self.client_obj, policy_number="DASH-02",
            start_date=start_of_month, status='ACTIVE',
            renewal_date=today + timedelta(days=15)
        )

    def test_get_dashboard_data(self):
        """Test that the insurance dashboard endpoint returns correct aggregated data."""
        url = reverse('insurances:dashboard')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = {
            "kpis_current_month": {
                "commissions_gross": 750.00,
                "new_policies_count": 2,
            },
            "upcoming_events": {
                "upcoming_renewals_count": 1,
            }
        }
        self.assertEqual(response.data, expected_data)
