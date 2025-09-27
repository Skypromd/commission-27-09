from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from backend.apps.core.models import Adviser, Client
from ..models import Insurer, Policy, Commission, Bonus

class InsuranceAPITests(APITestCase):
    def setUp(self):
        # Users
        self.admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        self.manager_user = User.objects.create_user('manager', 'manager@example.com', 'password')
        self.adviser1_user = User.objects.create_user('adviser1', 'adviser1@example.com', 'password')
        self.adviser2_user = User.objects.create_user('adviser2', 'adviser2@example.com', 'password')

        # Advisers
        self.manager = Adviser.objects.create(user=self.manager_user, is_manager=True)
        self.adviser1 = Adviser.objects.create(user=self.adviser1_user, manager=self.manager)
        self.adviser2 = Adviser.objects.create(user=self.adviser2_user)

        # Common objects
        self.client_obj = Client.objects.create(name="API Test Client")
        self.insurer = Insurer.objects.create(name="API Test Insurer")

        # Policies
        self.policy1 = Policy.objects.create(policy_number="API-POL-01", client=self.client_obj, adviser=self.adviser1, insurer=self.insurer, status=Policy.Status.ACTIVE)
        self.policy2 = Policy.objects.create(policy_number="API-POL-02", client=self.client_obj, adviser=self.adviser2, insurer=self.insurer, status=Policy.Status.PENDING)
        self.policy_manager = Policy.objects.create(policy_number="API-POL-MGR", client=self.client_obj, adviser=self.manager, insurer=self.insurer, status=Policy.Status.ACTIVE)

        # Commissions
        self.commission1 = Commission.objects.create(policy=self.policy1, gross_commission=1000, net_commission=800, date_received="2024-01-01")
        self.commission2 = Commission.objects.create(policy=self.policy2, gross_commission=500, net_commission=400, date_received="2024-01-02")
        self.commission_manager = Commission.objects.create(policy=self.policy_manager, gross_commission=2000, net_commission=1800, date_received="2024-01-03")

    def test_policy_list_permissions(self):
        """Test that users can only see policies they have permission for."""
        url = reverse('insurances:policy-list')

        # Adviser 1 sees only their own policy
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['policy_number'], self.policy1.policy_number)

        # Manager sees their own policy and their subordinate's policy
        self.client.force_authenticate(user=self.manager_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

        # Admin sees all policies
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 3)

    def test_commission_list_permissions(self):
        """Test that users can only see commissions for policies they have access to."""
        url = reverse('insurances:commission-list')

        # Adviser 1 sees only commission for their policy
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.commission1.id)

        # Manager sees commission for their subordinate's policy and their own
        self.client.force_authenticate(user=self.manager_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Manager should see commission1 (from adviser1) and their own commission_manager
        self.assertEqual(len(response.data['results']), 2)

        # Admin sees all commissions
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 3)

    def test_policy_creation(self):
        """Test that the creating user's adviser is automatically assigned."""
        url = reverse('insurances:policy-list')
        data = {
            'policy_number': 'API-POL-NEW',
            'client': self.client_obj.id,
            'insurer': self.insurer.id,
            'status': 'PENDING'
        }
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_policy = Policy.objects.get(policy_number='API-POL-NEW')
        self.assertEqual(new_policy.adviser, self.adviser1)

    def test_policy_filtering_and_searching(self):
        """Test filtering and searching on the policy list endpoint."""
        url = reverse('insurances:policy-list')
        self.client.force_authenticate(user=self.admin_user)

        # Test filtering by status
        response = self.client.get(url, {'status': 'ACTIVE'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        self.assertTrue(all(p['status'] == 'ACTIVE' for p in response.data['results']))

        # Test searching by policy number
        response = self.client.get(url, {'search': 'API-POL-01'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['policy_number'], 'API-POL-01')

    def test_policy_update_permissions(self):
        """Test that only authorized users can update a policy."""
        url = reverse('insurances:policy-detail', kwargs={'pk': self.policy1.pk})
        data = {'status': 'CANCELLED'}

        # Unrelated adviser CANNOT update
        self.client.force_authenticate(user=self.adviser2_user)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # 404 because of queryset filtering

        # Owner CAN update
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.policy1.refresh_from_db()
        self.assertEqual(self.policy1.status, 'CANCELLED')

    def test_policy_delete_permissions(self):
        """Test that only authorized users can delete a policy."""
        policy_to_delete_pk = self.policy1.pk
        url = reverse('insurances:policy-detail', kwargs={'pk': policy_to_delete_pk})

        # Unrelated adviser CANNOT delete
        self.client.force_authenticate(user=self.adviser2_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Manager CAN delete subordinate's policy
        self.client.force_authenticate(user=self.manager_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Policy.objects.filter(pk=policy_to_delete_pk).exists())

    def test_insurer_viewset_permissions(self):
        """Test that only admins can write to the Insurer endpoint."""
        list_url = reverse('insurances:insurer-list')
        detail_url = reverse('insurances:insurer-detail', kwargs={'pk': self.insurer.pk})
        data = {'name': 'New Insurer Name'}

        # Regular adviser can list but not create
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.get(list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.patch(detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin can create and update
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.patch(detail_url, {'name': 'Updated Name'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.insurer.refresh_from_db()
        self.assertEqual(self.insurer.name, 'Updated Name')

    def test_reporting_viewset_permissions(self):
        """Test that only admins can access reporting endpoints."""
        url = reverse('insurances:reporting-adviser-performance')

        # Regular adviser is forbidden
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin is allowed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ingestion_viewset_permissions(self):
        """Test that only admins can upload commission statements."""
        url = reverse('insurances:ingestion-upload-statement')
        csv_content = b"some,data,here\n"
        uploaded_file = SimpleUploadedFile("commissions.csv", csv_content, content_type="text/csv")

        # Regular adviser is forbidden
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.post(url, {'file': uploaded_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin is allowed (we expect a 200 OK, even if processing fails, as permission is granted)
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(url, {'file': uploaded_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_commission_modifier_permissions(self):
        """Test permissions for creating commission modifiers."""
        url = reverse('insurances:bonus-list')
        data = {'commission': self.commission1.id, 'amount': 100.00}

        # Adviser 1 (owner) CANNOT create a bonus
        self.client.force_authenticate(user=self.adviser1_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Adviser 2 (unrelated) CANNOT create a bonus
        self.client.force_authenticate(user=self.adviser2_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Manager of Adviser 1 CAN create a bonus
        self.client.force_authenticate(user=self.manager_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Bonus.objects.count(), 1)

        # Admin CAN create a bonus
        self.client.force_authenticate(user=self.admin_user)
        data['amount'] = 150.00 # change amount to create a new one
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Bonus.objects.count(), 2)
