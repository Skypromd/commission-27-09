from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CommissionViewSet,
    MortgageCaseViewSet,
    BrokerFeeViewSet,
    LenderViewSet,
    MortgageRetentionViewSet,
    MortgageClawbackViewSet,
    MortgageBonusViewSet,
    MortgageOverrideViewSet,
    MortgageReferralFeeViewSet,
    ReportingViewSet,
    DashboardViewSet,
    IngestionViewSet,
)

router = DefaultRouter()
router.register(r"lenders", LenderViewSet)
router.register(r"cases", MortgageCaseViewSet, basename="mortgagecase")
router.register(r"commissions", CommissionViewSet, basename="commission")
router.register(r"broker-fees", BrokerFeeViewSet, basename="brokerfee")
router.register(r"retentions", MortgageRetentionViewSet, basename="mortgageretention")
router.register(r"clawbacks", MortgageClawbackViewSet, basename="mortgageclawback")
router.register(r"bonuses", MortgageBonusViewSet, basename="mortgagebonus")
router.register(r"overrides", MortgageOverrideViewSet, basename="mortgageoverride")
router.register(r"referral-fees", MortgageReferralFeeViewSet, basename="mortgagereferralfee")
router.register(r"reports", ReportingViewSet, basename="reporting")
router.register(r"dashboard", DashboardViewSet, basename="dashboard")
router.register(r"ingestion", IngestionViewSet, basename="ingestion")

app_name = "mortgage"

urlpatterns = [
    path("", include(router.urls)),
]
