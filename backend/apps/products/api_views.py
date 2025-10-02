from rest_framework import viewsets, permissions
from .models import Product, ProductCategory
from .serializers import ProductSerializer, ProductCategorySerializer
from apps.commission.permissions import IsSuperAdminUser

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint для просмотра продуктов.
    Использует полиморфный сериализатор для отображения полной информации
    в зависимости от типа продукта (Ипотека, Страхование и т.д.).
    Доступен только для чтения. Управление продуктами - через админ-панель.

    API для просмотра каталога продуктов.
    Поддерживает фильтрацию по категории, например:
    /api/products/?category__name=Ипотека
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Администраторы видят все продукты, остальные - только активные.
        .select_related() оптимизирует запросы к дочерним таблицам.
        """
        queryset = Product.objects.filter(is_active=True).select_related('category')
        category_name = self.request.query_params.get('category__name')
        if category_name:
            queryset = queryset.filter(category__name__iexact=category_name)
        return queryset

class ProductCategoryViewSet(viewsets.ModelViewSet):
    """
    API для управления категориями продуктов.
    Полный доступ только для Супер-администраторов.
    """
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [IsSuperAdminUser]
