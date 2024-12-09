from django.db import models
from django.conf import settings
from events.models import Event, DJ
from django.utils import timezone
import uuid

class Survey(models.Model):
    """Model for creating and managing surveys."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    SURVEY_TYPES = [
        ('event', 'Event Feedback'),
        ('music', 'Music Preferences'),
        ('general', 'General Feedback'),
        ('experience', 'User Experience'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    survey_type = models.CharField(max_length=20, choices=SURVEY_TYPES)
    questions = models.JSONField()  # Stores survey questions and their types
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        to_field='id'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def is_active_for_user(self):
        """Check if the survey is active and within its date range."""
        now = timezone.now()
        return (
            self.is_active and
            self.start_date <= now and
            self.end_date >= now
        )

class SurveyResponse(models.Model):
    """Model for storing user responses to surveys."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='responses', to_field='id')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, to_field='id')
    responses = models.JSONField()  # Stores answers to survey questions
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'survey')

    def __str__(self):
        return f"{self.user.email}'s response to {self.survey.title}"

class Feedback(models.Model):
    """Model for general user feedback and suggestions."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    FEEDBACK_TYPES = [
        ('general', 'General'),
        ('suggestion', 'Suggestion'),
        ('complaint', 'Complaint'),
        ('praise', 'Praise'),
        ('bug', 'Bug Report'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, to_field='id')
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    event = models.ForeignKey(
        Event,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedback',
        to_field='id'
    )
    dj = models.ForeignKey(
        DJ,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedback',
        to_field='id'
    )
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('in_progress', 'In Progress'),
            ('resolved', 'Resolved'),
            ('closed', 'Closed'),
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.subject}"

class FeedbackResponse(models.Model):
    """Model for staff responses to user feedback."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='responses', to_field='id')
    responder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, to_field='id')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_internal = models.BooleanField(default=False)

    def __str__(self):
        return f"Response to {self.feedback.subject} by {self.responder.email}"
