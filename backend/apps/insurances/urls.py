from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InsurerViewSet, PolicyViewSet, CommissionViewSet, IngestionViewSet,
    ReportingViewSet, DashboardViewSet, InsuranceTypeViewSet,
    RetentionViewSet, ClawbackViewSet, BonusViewSet, OverrideViewSet, ReferralFeeViewSet
)

app_name = 'insurances'

# Main router for all resources
router = DefaultRouter()
router.register(r'insurers', InsurerViewSet)
router.register(r'insurance-types', InsuranceTypeViewSet, basename='insurancetype')
router.register(r'policies', PolicyViewSet, basename='policy')
router.register(r'commissions', CommissionViewSet, basename='commission')
router.register(r'ingestion', IngestionViewSet, basename='ingestion')
router.register(r'reports', ReportingViewSet, basename='reporting')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'retentions', RetentionViewSet, basename='retention')
router.register(r'clawbacks', ClawbackViewSet, basename='clawback')
router.register(r'bonuses', BonusViewSet, basename='bonus')
router.register(r'overrides', OverrideViewSet, basename='override')
router.register(r'referral-fees', ReferralFeeViewSet, basename='referralfee')


urlpatterns = [
    path('', include(router.urls)),
]
