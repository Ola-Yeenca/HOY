from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid

class DJ(models.Model):
    """Model for DJs performing at events."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    artist_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField()
    profile_image = models.ImageField(upload_to='dj_profiles/')
    genres = models.JSONField(default=list)
    social_media = models.JSONField(default=dict)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'DJ'
        verbose_name_plural = 'DJs'

    def __str__(self):
        return self.artist_name or self.name

class Event(models.Model):
    """Model for events/parties."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=255)
    description = models.TextField()
    date = models.DateField()
    start_time = models.TimeField()
    location = models.JSONField()  # Stores venue details including coordinates
    featured_image = models.ImageField(upload_to='event_images/')
    gallery_images = models.JSONField(default=list)  # Stores multiple image URLs
    
    # Event details
    djs = models.ManyToManyField(DJ, related_name='events')
    capacity = models.PositiveIntegerField()
    age_restriction = models.PositiveIntegerField(default=18)
    dress_code = models.TextField(blank=True)
    ticket_types = models.JSONField(default=list)  # Different ticket categories and prices
    perks = models.JSONField(default=list)  # Special features or offerings
    
    # Status and visibility
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    
    # Relationships
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_events',
        to_field='id'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['date', 'start_time']),
            models.Index(fields=['status']),
        ]
        ordering = ['-date', '-start_time']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def is_past(self):
        from django.utils import timezone
        return timezone.now().date() > self.date

class EventInteraction(models.Model):
    """Model for tracking user interactions with events."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, to_field='id')
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    interested = models.BooleanField(default=False)
    going = models.BooleanField(default=False)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        status = 'going' if self.going else 'interested' if self.interested else 'tracked'
        return f"{self.user.email} is {status} in {self.event.title}"
