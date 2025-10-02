from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet

router = DefaultRouter()
router.register(r"", ClientViewSet, basename="client")

app_name = "clients"

urlpatterns = [
    path("", include(router.urls)),
]
