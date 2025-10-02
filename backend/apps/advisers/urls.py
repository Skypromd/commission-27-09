from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import AdviserViewSet

router = DefaultRouter()
router.register(r'advisers', AdviserViewSet, basename='adviser-api')

urlpatterns = [
    path('', include(router.urls)),
]
