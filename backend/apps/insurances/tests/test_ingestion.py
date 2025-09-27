from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from decimal import Decimal

from apps.core.models import Adviser, Client
from apps.insurances.models import Insurer, Policy, Commission

class IngestionAPITests(APITestCase):
    def setUp(self):
        super().setUp()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass'
        )
        self.admin_token = Token.objects.create(user=self.admin_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)

        insurer = Insurer.objects.create(name="Test Insurer")
        adviser = Adviser.objects.create(user=self.admin_user)
        client = Client.objects.create(name="Ingestion Client")
        Policy.objects.create(adviser=adviser, insurer=insurer, client=client, policy_number="INGEST-POL-01")
        Policy.objects.create(adviser=adviser, insurer=insurer, client=client, policy_number="INGEST-POL-02")

    def test_commission_ingestion(self):
        """Test uploading a commission statement creates commission records."""
        csv_content = (
            b"INGEST-POL-01,1000.00,800.00\n"
            b"INGEST-POL-02,1500.50,1200.40\n"
            b"NON-EXISTENT-POL,100.00,90.00\n"
        )
        uploaded_file = SimpleUploadedFile("commissions.csv", csv_content, content_type="text/csv")

        url = reverse('insurances:ingestion-upload-statement')
        response = self.client.post(url, {'file': uploaded_file}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['processed'], 2)
        self.assertEqual(len(response.data['errors']), 1)
        self.assertIn("Policy 'NON-EXISTENT-POL' not found", response.data['errors'][0])

        self.assertEqual(Commission.objects.count(), 2)
        c1 = Commission.objects.get(policy__policy_number="INGEST-POL-01")
        self.assertEqual(c1.gross_commission, Decimal('1000.00'))
