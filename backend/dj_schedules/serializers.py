from rest_framework import serializers
from .models import DJSchedule

class DJScheduleSerializer(serializers.ModelSerializer):
    dj_name = serializers.CharField(source='dj.username', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)

    class Meta:
        model = DJSchedule
        fields = ['id', 'dj', 'dj_name', 'event', 'event_name', 'start_time', 'end_time', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
