from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Policy
from .services import create_commission_for_policy, handle_policy_cancellation_service

@receiver(post_save, sender=Policy)
def handle_policy_status_change(sender, instance, created, **kwargs):
    """
    A single signal handler that routes policy status changes to the correct service.
    Handles both creation and updates of policies.
    """
    # On updates, we optimize to only run if the 'status' field was part of the update.
    if not created:
        update_fields = kwargs.get('update_fields', None)
        if update_fields is not None and 'status' not in update_fields:
            return  # Exit early if status was not updated.

    # At this point, it's either a new object, a full save, or a specific status update.
    # We can now apply our business logic.
    if instance.status == Policy.PolicyStatus.ACTIVE:
        create_commission_for_policy(instance)
    elif instance.status == Policy.PolicyStatus.CANCELLED:
        handle_policy_cancellation_service(instance)

