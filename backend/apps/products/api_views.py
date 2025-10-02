from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.db.models import Count, Avg, Q
from django.utils import timezone

from .models import Product, ProductCategory
from .serializers import ProductSerializer, ProductCategorySerializer
from apps.core.permissions import IsAdminOrReadOnly


@extend_schema_view(
    list=extend_schema(description="List all products with categories and pricing"),
    create=extend_schema(description="Create a new product"),
    retrieve=extend_schema(description="Get product details with sales analytics"),
    update=extend_schema(description="Update product information"),
    destroy=extend_schema(description="Delete product"),
)
class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for comprehensive product management.
    Includes sales analytics, performance metrics, and recommendations.
    """
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # Временно для демо
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'provider', 'description']
    ordering_fields = ['name', 'created_at', 'category__name']
    ordering = ['name']
    filterset_fields = ['category', 'is_active', 'provider']

    @extend_schema(
        description="Get product sales analytics and performance",
        responses={200: {
            'type': 'object',
            'properties': {
                'sales_count': {'type': 'integer'},
                'total_revenue': {'type': 'number'},
                'avg_commission': {'type': 'number'},
                'top_advisers': {'type': 'array'},
                'monthly_trends': {'type': 'array'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        """Get comprehensive product analytics"""
        product = self.get_object()
        
        # Mock analytics data - will be replaced with real calculations
        analytics_data = {
            'sales_count': 45,
            'total_revenue': 123500.00,
            'avg_commission': 850.00,
            'conversion_rate': 0.23,
            'customer_satisfaction': 4.2,
            'top_advisers': [
                {'name': 'John Smith', 'sales': 12, 'commission': 10200},
                {'name': 'Sarah Johnson', 'sales': 8, 'commission': 6800},
                {'name': 'Mike Wilson', 'sales': 6, 'commission': 5100}
            ],
            'monthly_trends': [
                {'month': '2024-01', 'sales': 8, 'revenue': 22000},
                {'month': '2024-02', 'sales': 12, 'revenue': 33000}, 
                {'month': '2024-03', 'sales': 15, 'revenue': 41500},
                {'month': '2024-04', 'sales': 10, 'revenue': 27000}
            ],
            'competitor_comparison': {
                'market_position': 'Leading',
                'price_competitiveness': 'Competitive',
                'feature_score': 4.5
            }
        }
        
        return Response(analytics_data)

    @extend_schema(
        description="Get product recommendations for cross-selling",
        responses={200: {
            'type': 'object',
            'properties': {
                'recommended_products': {'type': 'array'},
                'bundle_opportunities': {'type': 'array'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        """Get AI-powered product recommendations"""
        product = self.get_object()
        
        # Mock recommendation data
        recommendations = {
            'recommended_products': [
                {
                    'id': 2,
                    'name': 'Health Insurance Plus',
                    'match_score': 0.89,
                    'reason': 'Frequently bought together',
                    'potential_revenue': 2500
                },
                {
                    'id': 3,
                    'name': 'Travel Coverage',
                    'match_score': 0.76,
                    'reason': 'Complementary coverage',
                    'potential_revenue': 1200
                }
            ],
            'bundle_opportunities': [
                {
                    'name': 'Family Protection Bundle',
                    'products': [product.id, 2, 5],
                    'discount': 15,
                    'estimated_uptake': 0.34
                }
            ],
            'seasonal_trends': {
                'peak_months': ['January', 'September'],
                'low_months': ['July', 'August'],
                'seasonal_factor': 1.2
            }
        }
        
        return Response(recommendations)


@extend_schema_view(
    list=extend_schema(description="List all product categories"),
    create=extend_schema(description="Create a new product category"),
    retrieve=extend_schema(description="Get category details with products"),
    update=extend_schema(description="Update category information"),
    destroy=extend_schema(description="Delete category"),
)
class ProductCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for product category management.
    """
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.AllowAny]  # Временно для демо
    search_fields = ['name', 'description']
    ordering = ['name']

    @extend_schema(
        description="Get category performance statistics",
        responses={200: {
            'type': 'object',
            'properties': {
                'product_count': {'type': 'integer'},
                'total_sales': {'type': 'integer'},
                'avg_performance': {'type': 'number'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get category performance statistics"""
        category = self.get_object()
        
        stats = {
            'product_count': category.products.count(),
            'active_products': category.products.filter(is_active=True).count(),
            'total_sales': 0,  # Will be calculated from actual sales data
            'avg_performance': 0,  # Average performance across products
            'top_products': []  # Top performing products in category
        }
        
        return Response(stats)
