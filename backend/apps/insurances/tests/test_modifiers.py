from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from apps.core.models import Adviser, Client
from apps.insurances.models import Insurer, Policy, Commission

class ModifierAPITests(APITestCase):
    def setUp(self):
        self.manager_user = User.objects.create_user(username='mod_manager', password='pw')
        self.manager_adviser = Adviser.objects.create(user=self.manager_user)
        self.manager_token = Token.objects.create(user=self.manager_user)

        self.sub_user = User.objects.create_user(username='mod_sub', password='pw')
        self.sub_adviser = Adviser.objects.create(user=self.sub_user, manager=self.manager_adviser)

        client = Client.objects.create(name="Modifier Client")
        insurer = Insurer.objects.create(name="Test Insurer")
        policy = Policy.objects.create(adviser=self.sub_adviser, insurer=insurer, client=client, policy_number="MOD-POL-01")
        self.commission = Commission.objects.create(policy=policy, gross_commission=1000)

    def test_manager_can_create_bonus_for_subordinate(self):
        """A manager can create a bonus for their subordinate's commission."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.manager_token.key)
        url = reverse('insurances:bonus-list')
        data = {"commission": self.commission.pk, "amount": 100.00, "reason": "Good work"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.commission.bonus_set.count(), 1)

    def test_subordinate_cannot_create_bonus_for_self(self):
        """A subordinate cannot create a bonus for their own commission."""
        sub_token = Token.objects.create(user=self.sub_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + sub_token.key)
        url = reverse('insurances:bonus-list')
        data = {"commission": self.commission.pk, "amount": 100.00}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
