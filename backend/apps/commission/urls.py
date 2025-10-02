from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

app_name = "commission"

api_router = DefaultRouter()
api_router.register(r'commissions', api_views.CommissionViewSet, basename='commission')
api_router.register(r'overrides', api_views.OverrideViewSet, basename='override')
api_router.register(r'retentions', api_views.RetentionViewSet, basename='retention')
api_router.register(r'clawbacks', api_views.ClawbackViewSet, basename='clawback')
api_router.register(r'splits', api_views.CommissionSplitViewSet, basename='split')
api_router.register(r'advances', api_views.AdvanceViewSet, basename='advance')
api_router.register(r'repayments', api_views.RepaymentViewSet, basename='repayment')
api_router.register(r'bonuses', api_views.CommissionBonusViewSet, basename='bonus')
api_router.register(r'referral-fees', api_views.ReferralFeeViewSet, basename='referralfee')
api_router.register(r'vesting-schedules', api_views.VestingScheduleViewSet, basename='vesting-schedule')
api_router.register(r'scheduled-payouts', api_views.ScheduledPayoutViewSet, basename='scheduled-payout')

urlpatterns = [
    path("", include(api_router.urls)),
    path("statistics/", api_views.CommissionStatisticsAPIView.as_view(), name="commission-statistics-api"),
    path("top-performers/", api_views.TopPerformersAPIView.as_view(), name="top-performers-api"),
    path("commission-calculator/", api_views.CommissionCalculatorAPIView.as_view(), name="commission-calculator-api"),
    path("my-profile/", api_views.MyProfileAPIView.as_view(), name="my-profile-api"),
]
