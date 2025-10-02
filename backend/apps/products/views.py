from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ProductCategory, Product
from .serializers import ProductCategorySerializer, ProductSerializer
from apps.core.permissions import IsAdminOrReadOnly
from .filters import ProductFilter

class ProductCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows product categories to be viewed or edited by admins.
    """
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited by admins.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
