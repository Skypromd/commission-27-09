from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import DealViewSet, PipelineViewSet, StageViewSet

router = DefaultRouter()
router.register(r'deals', DealViewSet, basename='deal-api')
router.register(r'pipelines', PipelineViewSet, basename='pipeline-api')
router.register(r'stages', StageViewSet, basename='stage-api')

urlpatterns = [
    path('', include(router.urls)),
]
