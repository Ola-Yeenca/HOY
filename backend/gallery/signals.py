from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Gallery, Image


@receiver(post_save, sender=Gallery)
def gallery_saved(sender, instance, created, **kwargs):
    """Handle post-save actions for galleries."""
    pass  # Add any necessary post-save logic here


@receiver(post_save, sender=Image)
def image_saved(sender, instance, created, **kwargs):
    """Handle post-save actions for images."""
    pass  # Add any necessary post-save logic here
