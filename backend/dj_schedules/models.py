from django.db import models
from django.conf import settings

# Create your models here.

class DJSchedule(models.Model):
    dj = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Scheduled'),
        ('performing', 'Performing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.dj.username} - {self.event.name} ({self.start_time})"
