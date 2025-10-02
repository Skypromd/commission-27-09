from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommissionViewSet

router = DefaultRouter()
router.register(r'commissions', CommissionViewSet, basename='commissions')

urlpatterns = [
    path('', include(router.urls)),
]
