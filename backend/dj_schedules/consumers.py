import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.serializers import serialize
from .models import DJSchedule

class DJScheduleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the DJ schedules group
        await self.channel_layer.group_add(
            "dj_schedules",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the DJ schedules group
        await self.channel_layer.group_discard(
            "dj_schedules",
            self.channel_name
        )

    async def receive(self, text_data):
        # Handle incoming messages (if needed)
        pass

    async def schedule_update(self, event):
        # Send schedule update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'schedule_update',
            'schedule': event['schedule']
        }))

    @database_sync_to_async
    def get_schedule(self, schedule_id):
        schedule = DJSchedule.objects.get(id=schedule_id)
        return json.loads(serialize('json', [schedule]))[0]
