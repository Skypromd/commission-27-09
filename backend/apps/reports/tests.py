from decimal import Decimal
from unittest.mock import patch
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.audit.models import AuditLog
from apps.clients.models import Client
from apps.mortgage.models import Commission, MortgageCase, Lender
from apps.notifications.models import Notification
from .models import Report
from .services import FinancialReportService, DetailedReportService, ReportServiceFactory, PerformanceReportService
from .tasks import generate_and_save_report_task

User = get_user_model()


class ReportViewIntegrationTests(APITestCase):
    def setUp(self):
        self.manager = User.objects.create_user(username="manager", password="testpassword", role=User.Role.MANAGER)
        self.client.login(username="manager", password="testpassword")

    @patch("apps.reports.views.generate_and_save_report_task.delay")
    def test_create_report_async(self, mock_delay):
        """Ensure creating a report triggers a Celery task."""
        mock_delay.return_value.id = "test-task-id"
        url = reverse("reports:report-list")
        data = {"name": "Monthly Financials", "report_type": "forecast"}

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(response.data["name"], "Monthly Financials")
        self.assertEqual(response.data["status"], Report.Status.PENDING)
        self.assertEqual(response.data["task_id"], "test-task-id")
        self.assertTrue(mock_delay.called)
        self.assertTrue(AuditLog.objects.filter(user=self.manager, action__contains="Запрошен отчет").exists())


class ServicesAndTasksTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.manager = User.objects.create_user(username="manager", password="testpassword", role=User.Role.MANAGER)
        self.adviser1 = User.objects.create_user(username="adviser1", password="testpassword", role=User.Role.ADVISER, parent=self.manager)

        client = Client.objects.create(first_name="Test", last_name="Client")
        lender = Lender.objects.create(name="Test Bank")

        # Completed case
        self.completed_case = MortgageCase.objects.create(
            client=client, adviser=self.adviser1, lender=lender, status=MortgageCase.Status.COMPLETED,
            created_at=date(2024, 1, 1), completion_date=date(2024, 1, 15)
        )
        self.commission1 = Commission.objects.create(
            mortgage_case=self.completed_case, gross_commission=Decimal("2000.00"), net_commission=Decimal("1800.00")
        )

        # Projected case
        self.projected_case = MortgageCase.objects.create(
            client=client, adviser=self.adviser1, lender=lender, status=MortgageCase.Status.IN_PROGRESS,
            loan_amount=Decimal("500000.00")
        )
        Commission.objects.create(
            mortgage_case=self.projected_case, gross_commission=Decimal("0.00"), forecasted_commission=Decimal("5000.00")
        )

    def test_financial_report_service_logic(self):
        """Test the logic of the FinancialReportService."""
        request = self.factory.get("/fake-url")
        request.user = self.manager

        service = FinancialReportService(request)
        report = service.generate_report()

        self.assertEqual(report["earned_commission"]["gross_commission_total"], self.commission1.gross_commission)
        self.assertEqual(report["earned_commission"]["net_commission_total"], self.commission1.net_commission)
        self.assertEqual(report["projected_income"], Decimal("5000.00"))

    def test_performance_report_service(self):
        """Test the logic of the PerformanceReportService."""
        request = self.factory.get("/fake-url")
        request.user = self.manager
        service = PerformanceReportService(request)
        report_data = service.generate_report()

        self.assertEqual(len(report_data), 1)
        adviser1_data = report_data[0]
        self.assertEqual(adviser1_data['adviser__username'], self.adviser1.username)
        self.assertEqual(adviser1_data['total_cases'], 2)
        self.assertEqual(adviser1_data['closed_cases'], 1)
        self.assertEqual(adviser1_data['total_commission'], self.commission1.gross_commission)
        self.assertEqual(adviser1_data['avg_closing_time_days'], 14)

    def test_generate_report_task_with_financial_service(self):
        """Test the Celery task with the FinancialReportService."""
        report = Report.objects.create(name="Financial Forecast", report_type=Report.ReportType.FORECAST, generated_by=self.manager)

        generate_and_save_report_task(report.id, self.manager.id, {})

        report.refresh_from_db()
        self.assertEqual(report.status, Report.Status.SUCCESS)
        self.assertEqual(Decimal(report.data["earned_commission"]["gross_commission_total"]), self.commission1.gross_commission)
        self.assertTrue(Notification.objects.filter(user=self.manager, message__contains="успешно сгенерирован").exists())
        self.assertTrue(AuditLog.objects.filter(user=self.manager, action__contains="успешно сгенерирован").exists())
