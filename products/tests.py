from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Product, Category


class TestProductViewSet(APITestCase):
    def setUp(self):
        """
        Create a product and a category for testing.
        """
        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(name='Test Product', category=self.category)

    def test_get_all_products(self):
        """
        Ensure we can retrieve all products.
        """
        url = reverse('product-list')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.product.name)

    def test_filter_products_by_category(self):
        """
        Ensure we can filter products by category name.
        """
        category1 = Category.objects.create(name='Life Insurance')
        category2 = Category.objects.create(name='Health Insurance')
        Product.objects.create(name='Term Life', category=category1)
        Product.objects.create(name='Whole Life', category=category1)
        Product.objects.create(name='PPO Plan', category=category2)

        url = reverse('product-list')
        response = self.client.get(url, {'category': 'Life Insurance'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertTrue(all(p['category_name'] == 'Life Insurance' for p in response.data))

    def test_search_products_by_name(self):
        """
        Ensure we can search for products by name.
        """
        category = Category.objects.create(name='General')
        Product.objects.create(name='Term Life A', category=category)
        Product.objects.create(name='Term Life B', category=category)
        Product.objects.create(name='Whole Life', category=category)

        url = reverse('product-list')
        response = self.client.get(url, {'search': 'Term'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertTrue(all('Term' in p['name'] for p in response.data))
