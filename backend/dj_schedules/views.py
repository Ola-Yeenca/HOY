from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import DJSchedule
from .serializers import DJScheduleSerializer

# Create your views here.

class DJScheduleViewSet(viewsets.ModelViewSet):
    queryset = DJSchedule.objects.all()
    serializer_class = DJScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        schedule = serializer.save()
        self._broadcast_schedule_update(schedule)

    def perform_update(self, serializer):
        schedule = serializer.save()
        self._broadcast_schedule_update(schedule)

    def perform_destroy(self, instance):
        schedule_id = instance.id
        super().perform_destroy(instance)
        self._broadcast_schedule_delete(schedule_id)

    def _broadcast_schedule_update(self, schedule):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "dj_schedules",
            {
                "type": "schedule_update",
                "schedule": DJScheduleSerializer(schedule).data
            }
        )

    def _broadcast_schedule_delete(self, schedule_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "dj_schedules",
            {
                "type": "schedule_update",
                "schedule": {"id": schedule_id, "deleted": True}
            }
        )
