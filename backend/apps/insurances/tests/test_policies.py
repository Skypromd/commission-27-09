from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from datetime import date

from apps.core.models import Adviser, Client
from apps.insurances.models import Insurer, Policy

class PolicyAPITests(APITestCase):
    def setUp(self):
        self.manager_user = User.objects.create_user(username='ins_manager', password='pw')
        self.manager_adviser = Adviser.objects.create(user=self.manager_user)
        self.manager_token = Token.objects.create(user=self.manager_user)

        self.sub_user = User.objects.create_user(username='ins_sub', password='pw')
        self.sub_adviser = Adviser.objects.create(user=self.sub_user, manager=self.manager_adviser)
        self.sub_token = Token.objects.create(user=self.sub_user)

        self.client_obj = Client.objects.create(name="Test Client")
        self.insurer = Insurer.objects.create(name="Test Insurer")
        self.manager_policy = Policy.objects.create(adviser=self.manager_adviser, insurer=self.insurer, client=self.client_obj, policy_number="MGR-POL-01")
        self.sub_policy = Policy.objects.create(adviser=self.sub_adviser, insurer=self.insurer, client=self.client_obj, policy_number="SUB-POL-01")

    def test_subordinate_sees_only_own_policy(self):
        """A subordinate should only see their own policies in the list view."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.sub_token.key)
        response = self.client.get(reverse('insurances:policy-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['policy_number'], "SUB-POL-01")

    def test_manager_sees_own_and_subordinate_policies(self):
        """A manager should see their own and their subordinate's policies."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.manager_token.key)
        response = self.client.get(reverse('insurances:policy-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_policies_by_status(self):
        """Test that policies can be filtered by status."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.manager_token.key)
        url = reverse('insurances:policy-list')
        response = self.client.get(url, {'status': 'IN_REVIEW'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['policy_number'], "SUB-POL-01")

    def test_subordinate_cannot_access_manager_policy_detail(self):
        """A subordinate should get a 404 when trying to access a manager's policy directly."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.sub_token.key)
        response = self.client.get(reverse('insurances:policy-detail', kwargs={'pk': self.manager_policy.pk}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_policy_auto_assigns_adviser(self):
        """Creating a policy via the API should auto-assign the logged-in adviser."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.sub_token.key)
        data = {
            "insurer": self.insurer.pk,
            "client": self.client_obj.pk,
            "policy_number": "NEW-POL-01",
            "start_date": date.today()
        }
        response = self.client.post(reverse('insurances:policy-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_policy = Policy.objects.get(policy_number="NEW-POL-01")
        self.assertEqual(new_policy.adviser, self.sub_adviser)
