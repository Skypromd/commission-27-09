from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ProductViewSet, ProductCategoryViewSet
from .views import ProductViewSet as OldProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', ProductCategoryViewSet)
# Keep old viewset for compatibility
router.register(r'products-old', OldProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
