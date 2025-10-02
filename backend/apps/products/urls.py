from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ProductViewSet, ProductCategoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product-api')
router.register(r'categories', ProductCategoryViewSet, basename='category-api')

urlpatterns = [
    path('', include(router.urls)),
]
