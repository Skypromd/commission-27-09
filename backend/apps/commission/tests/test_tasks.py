from django.test import TestCase
from decimal import Decimal
from unittest import mock

# Импортируем модели
from backend.apps.users.models import CustomUser
from backend.apps.deals.models import Deal
from backend.apps.clients.models import Client
from backend.apps.products.models import Product
from ..models import Commission

# Импортируем задачу
from ..tasks import generate_and_send_commission_report

class CeleryTasksTests(TestCase):

    def setUp(self):
        self.manager = CustomUser.objects.create_user(username='report_manager', email='manager@report.com', password='password')
        subordinate = CustomUser.objects.create_user(username='report_sub', parent=self.manager, password='password')
        client = Client.objects.create(name="Report Client", user=self.manager)
        product = Product.objects.create(name="Report Product")

        deal1 = Deal.objects.create(user=subordinate, client=client, product=product, title="Report Deal 1", base_amount=1000)
        Commission.objects.create(user=subordinate, deal=deal1, amount=Decimal('100.00'), status=Commission.Status.PAID)

        deal2 = Deal.objects.create(user=self.manager, client=client, product=product, title="Report Deal 2", base_amount=2000)
        Commission.objects.create(user=self.manager, deal=deal2, amount=Decimal('200.00'), status=Commission.Status.PAID)

    @mock.patch('backend.apps.commission.tasks.send_mail')
    def test_generate_and_send_commission_report(self, mock_send_mail):
        generate_and_send_commission_report(self.manager.id)

        mock_send_mail.assert_called_once()
        call_args, call_kwargs = mock_send_mail.call_args

        self.assertEqual(call_kwargs['recipient_list'], [self.manager.email])
        self.assertIn("Commission Report", call_kwargs['subject'])

        email_body = call_kwargs['message']
        self.assertIn("Total paid commission amount for your team: £300.00", email_body)
        self.assertIn("User: report_sub", email_body)
        self.assertIn("User: report_manager", email_body)
