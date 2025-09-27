from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'advisers', api_views.AdviserViewSet, basename='adviser')

urlpatterns = [
    path('', include(router.urls)),
]
