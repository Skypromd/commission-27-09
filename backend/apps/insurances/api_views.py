from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Policy, Insurer, InsuranceType, Commission, Retention,
    Clawback, Bonus, Override, ReferralFee
)
from .serializers import (
    PolicyDetailSerializer, PolicyListSerializer, InsurerSerializer, InsuranceTypeSerializer, CommissionSerializer,
    RetentionSerializer, ClawbackSerializer, BonusSerializer, OverrideSerializer,
    ReferralFeeSerializer
)
from apps.core.permissions import IsManager, IsOwnerOrManager

# --- Main ViewSets ---
class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all().select_related(
        'adviser__user', 'client', 'insurer', 'insurance_type', 'commission'
    )
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]

    def get_serializer_class(self):
        if self.action == 'list':
            return PolicyListSerializer
        return PolicyDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'adviser_profile'): return Policy.objects.none()
        profile = user.adviser_profile
        if profile.role == 'MANAGER':
            subordinates = profile.subordinates.all()
            return self.queryset.filter(adviser__in=list(subordinates) + [profile])
        return self.queryset.filter(adviser=profile)

class CommissionViewSet(viewsets.ModelViewSet):
    queryset = Commission.objects.all().prefetch_related(
        'retentions', 'clawbacks', 'bonuses', 'overrides', 'referralfees'
    )
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'adviser_profile'): return Commission.objects.none()
        profile = user.adviser_profile
        if profile.role == 'MANAGER':
            subordinates = profile.subordinates.all()
            return self.queryset.filter(policy__adviser__in=list(subordinates) + [profile])
        return self.queryset.filter(policy__adviser=profile)

# --- Lookup ViewSets ---
class InsurerViewSet(viewsets.ModelViewSet):
    queryset = Insurer.objects.all()
    serializer_class = InsurerSerializer
    permission_classes = [permissions.IsAuthenticated]

class InsuranceTypeViewSet(viewsets.ModelViewSet):
    queryset = InsuranceType.objects.all()
    serializer_class = InsuranceTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- Modifier ViewSets (Manager Access Only) ---
class RetentionViewSet(viewsets.ModelViewSet):
    serializer_class = RetentionSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return Retention.objects.filter(commission_id=self.kwargs['commission_pk'])

    def perform_create(self, serializer):
        serializer.save(commission_id=self.kwargs['commission_pk'])

    @action(detail=True, methods=['post'])
    def release(self, request, commission_pk=None, pk=None):
        """
        Custom action to mark a retention as released.
        """
        retention = self.get_object()
        retention.release()
        return Response({'status': 'retention released'}, status=status.HTTP_200_OK)

class ClawbackViewSet(viewsets.ModelViewSet):
    serializer_class = ClawbackSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return Clawback.objects.filter(commission_id=self.kwargs['commission_pk'])

    def perform_create(self, serializer):
        serializer.save(commission_id=self.kwargs['commission_pk'])

    @action(detail=True, methods=['post'])
    def recover(self, request, commission_pk=None, pk=None):
        """
        Custom action to mark a clawback as recovered.
        """
        clawback = self.get_object()
        clawback.recover()
        return Response({'status': 'clawback recovered'}, status=status.HTTP_200_OK)

class BonusViewSet(viewsets.ModelViewSet):
    serializer_class = BonusSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return Bonus.objects.filter(commission_id=self.kwargs['commission_pk'])

    def perform_create(self, serializer):
        serializer.save(commission_id=self.kwargs['commission_pk'])

class OverrideViewSet(viewsets.ModelViewSet):
    serializer_class = OverrideSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return Override.objects.filter(commission_id=self.kwargs['commission_pk'])

    def perform_create(self, serializer):
        serializer.save(commission_id=self.kwargs['commission_pk'])

class ReferralFeeViewSet(viewsets.ModelViewSet):
    serializer_class = ReferralFeeSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return ReferralFee.objects.filter(commission_id=self.kwargs['commission_pk'])

    def perform_create(self, serializer):
        serializer.save(commission_id=self.kwargs['commission_pk'])
