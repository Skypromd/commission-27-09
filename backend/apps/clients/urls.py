from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ClientViewSet
from .views import ClientViewSet as OldClientViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
# Keep old viewset for compatibility
router.register(r'clients-old', OldClientViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
