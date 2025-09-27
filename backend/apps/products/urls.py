from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductCategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet, basename='product-category')
router.register(r'', ProductViewSet, basename='product') # Теперь /api/products/ будет вести на список продуктов

urlpatterns = [
    path('', include(router.urls)),
]
