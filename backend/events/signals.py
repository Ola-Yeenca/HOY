from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Event, DJ, EventInteraction


@receiver(post_save, sender=Event)
def event_saved(sender, instance, created, **kwargs):
    """Handle post-save actions for events."""
    pass  # Add any necessary post-save logic here


@receiver(post_save, sender=DJ)
def dj_saved(sender, instance, created, **kwargs):
    """Handle post-save actions for DJs."""
    pass  # Add any necessary post-save logic here


@receiver(post_save, sender=EventInteraction)
def event_interaction_saved(sender, instance, created, **kwargs):
    """Handle post-save actions for event interactions."""
    pass  # Add any necessary post-save logic here
