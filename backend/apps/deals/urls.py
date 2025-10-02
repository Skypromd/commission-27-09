from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import DealViewSet, PipelineViewSet, StageViewSet
from .views import DealViewSet as OldDealViewSet

router = DefaultRouter()
router.register(r'deals', DealViewSet, basename='deals')
router.register(r'pipelines', PipelineViewSet)
router.register(r'stages', StageViewSet)
# Keep old viewset for compatibility
router.register(r'deals-old', OldDealViewSet, basename='deals-old')

urlpatterns = [
    path('', include(router.urls)),
]
