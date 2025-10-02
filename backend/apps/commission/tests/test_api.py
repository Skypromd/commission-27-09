from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Client, Deal

class ClientAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        self.client_data = {'name': 'Test Client', 'email': 'test@example.com', 'phone': '1234567890'}
        self.client_instance = Client.objects.create(user=self.user, name='Initial Client', email='initial@example.com')

    def test_create_client(self):
        response = self.client.post('/api/clients/', self.client_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Client.objects.count(), 2)
        self.assertEqual(Client.objects.latest('id').name, 'Test Client')

    def test_get_client_list(self):
        response = self.client.get('/api/clients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.client_instance.name)

    def test_get_client_detail(self):
        response = self.client.get(f'/api/clients/{self.client_instance.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.client_instance.name)

    def test_update_client(self):
        updated_data = {'name': 'Updated Client Name'}
        response = self.client.put(f'/api/clients/{self.client_instance.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client_instance.refresh_from_db()
        self.assertEqual(self.client_instance.name, 'Updated Client Name')

    def test_delete_client(self):
        response = self.client.delete(f'/api/clients/{self.client_instance.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Client.objects.count(), 0)


class DealAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        self.client_instance = Client.objects.create(user=self.user, name='Test Client', email='test@example.com')
        self.deal_data = {
            'client': self.client_instance.id,
            'title': 'Test Deal',
            'base_amount': '1000.00',
            'commission_rate': '10.00',
            'product_type': 'mortgage',
        }
        self.deal_instance = Deal.objects.create(
            user=self.user,
            client=self.client_instance,
            title='Initial Deal',
            base_amount='500.00',
            commission_rate='5.00'
        )

    def test_create_deal(self):
        response = self.client.post('/api/deals/', self.deal_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Deal.objects.count(), 2)
        self.assertEqual(Deal.objects.latest('id').title, 'Test Deal')

    def test_get_deal_list(self):
        response = self.client.get('/api/deals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.deal_instance.title)

    def test_get_deal_detail(self):
        response = self.client.get(f'/api/deals/{self.deal_instance.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.deal_instance.title)

    def test_update_deal(self):
        updated_data = {
            'client': self.client_instance.id,
            'title': 'Updated Deal Name',
            'base_amount': '2000.00',
            'commission_rate': '15.00',
            'product_type': 'insurances',
        }
        response = self.client.put(f'/api/deals/{self.deal_instance.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.deal_instance.refresh_from_db()
        self.assertEqual(self.deal_instance.title, 'Updated Deal Name')

    def test_delete_deal(self):
        response = self.client.delete(f'/api/deals/{self.deal_instance.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Deal.objects.count(), 0)
from django.test import TestCase
from django.contrib.auth.models import Group
from rest_framework.test import APIClient
from decimal import Decimal

# Импортируем модели
from apps.users.models import CustomUser
from apps.deals.models import Deal
from apps.clients.models import Client
from apps.products.models import Product
from ..models import Commission, Clawback
from ..rules_engine import calculate_commission_amount

class HierarchicalPermissionsAPITests(TestCase):

    def setUp(self):
        Group.objects.create(name='Manager')
        self.admin = CustomUser.objects.create_superuser('admin', 'admin@test.com', 'password')
        self.manager = CustomUser.objects.create_user(username='manager', password='password')
        self.manager.groups.add(Group.objects.get(name='Manager'))
        self.subordinate = CustomUser.objects.create_user(username='subordinate', parent=self.manager, password='password')
        self.other_user = CustomUser.objects.create_user(username='other', password='password')

        client_obj = Client.objects.create(name="Client A", user=self.manager)
        product_obj = Product.objects.create(name="Product X")

        Deal.objects.create(user=self.manager, client=client_obj, product=product_obj, title="Manager's Deal", base_amount=1)
        Deal.objects.create(user=self.subordinate, client=client_obj, product=product_obj, title="Subordinate's Deal", base_amount=1)
        Deal.objects.create(user=self.other_user, client=client_obj, product=product_obj, title="Other's Deal", base_amount=1)

        self.client = APIClient()
        self.base_url = '/api/commission/deals/'

    def test_consultant_sees_only_own_deals(self):
        self.client.force_authenticate(user=self.subordinate)
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Subordinate's Deal")

    def test_manager_sees_team_deals(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        deal_titles = {d['title'] for d in response.data}
        self.assertTrue({"Manager's Deal", "Subordinate's Deal"}.issubset(deal_titles))
        self.assertNotIn("Other's Deal", deal_titles)

    def test_admin_sees_all_deals(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

class ClawbackAPITests(TestCase):

    def setUp(self):
        self.manager = CustomUser.objects.create_user(username='clawback_manager', is_staff=True, password='password')
        self.subordinate = CustomUser.objects.create_user(username='clawback_sub', parent=self.manager, password='password')
        client = Client.objects.create(name="Clawback Client", user=self.manager)
        product = Product.objects.create(name="Clawback Product")
        self.deal = Deal.objects.create(user=self.subordinate, client=client, product=product, title="Deal to be rejected", base_amount=Decimal('10000.00'), commission_rate=Decimal('5.00'))
        calculate_commission_amount(self.deal)
        self.api_client = APIClient()
        self.api_client.force_authenticate(user=self.manager)

    def test_clawback_is_created_on_deal_rejection(self):
        commission = Commission.objects.get(deal=self.deal)
        rejection_reason = "Client cancelled"
        url = f'/api/commission/deals/{self.deal.id}/reject/'
        response = self.api_client.put(url, {'reason': rejection_reason}, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(Clawback.objects.filter(deal=self.deal).exists())
        clawback = Clawback.objects.get(deal=self.deal)
        self.assertEqual(clawback.amount, commission.amount)
        self.assertIn(rejection_reason, clawback.reason)