from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import ProductCategory, Product

User = get_user_model()

class ProductAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        self.adviser_user = User.objects.create_user('adviser', 'adviser@test.com', 'password', role=User.Role.ADVISER)

        self.category = ProductCategory.objects.create(name="Life Insurance")
        self.product = Product.objects.create(name="Term Life", category=self.category, description="Standard term life product")

        # Create another category and product for testing filters
        self.category2 = ProductCategory.objects.create(name="Health Insurance")
        self.product2 = Product.objects.create(name="Critical Illness Cover", category=self.category2)


    def test_adviser_can_read_products(self):
        """Проверяем, что обычный консультант может читать список продуктов."""
        self.client.force_authenticate(user=self.adviser_user)
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_adviser_cannot_create_product(self):
        """Проверяем, что обычный консультант не может создавать продукт."""
        self.client.force_authenticate(user=self.adviser_user)
        data = {'name': 'New Product', 'category': self.category.name}
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_product(self):
        """Проверяем, что администратор может создавать продукт."""
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'New Product by Admin', 'category': self.category.name}
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Product.objects.filter(name='New Product by Admin').exists())

    def test_filter_products_by_category(self):
        """Проверяем фильтрацию продуктов по имени категории."""
        self.client.force_authenticate(user=self.adviser_user)
        response = self.client.get('/api/products/?category=Life%20Insurance')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Term Life')

    def test_search_products_by_name(self):
        """Проверяем поиск продуктов по названию."""
        self.client.force_authenticate(user=self.adviser_user)
        response = self.client.get('/api/products/?search=Critical')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Critical Illness Cover')
