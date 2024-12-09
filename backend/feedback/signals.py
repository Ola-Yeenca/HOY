from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import Feedback, FeedbackResponse

@receiver(post_save, sender=Feedback)
def notify_staff_new_feedback(sender, instance, created, **kwargs):
    """Notify staff members when new feedback is submitted."""
    if created and hasattr(settings, 'STAFF_NOTIFICATION_EMAIL'):
        context = {
            'feedback': instance,
            'admin_url': f"{settings.ADMIN_URL}feedback/feedback/{instance.id}/change/"
        }
        
        html_message = render_to_string('feedback/email/new_feedback.html', context)
        plain_message = render_to_string('feedback/email/new_feedback.txt', context)
        
        send_mail(
            subject=f'New Feedback: {instance.subject}',
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.STAFF_NOTIFICATION_EMAIL],
            fail_silently=True
        )

@receiver(post_save, sender=FeedbackResponse)
def notify_user_feedback_response(sender, instance, created, **kwargs):
    """Notify user when their feedback receives a response."""
    if created and not instance.is_internal and instance.feedback.user.email:
        context = {
            'feedback': instance.feedback,
            'response': instance,
            'user': instance.feedback.user
        }
        
        html_message = render_to_string('feedback/email/feedback_response.html', context)
        plain_message = render_to_string('feedback/email/feedback_response.txt', context)
        
        send_mail(
            subject=f'Response to your feedback: {instance.feedback.subject}',
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.feedback.user.email],
            fail_silently=True
        )
