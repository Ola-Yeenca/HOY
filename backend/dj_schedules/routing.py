from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/dj-schedules/$', consumers.DJScheduleConsumer.as_asgi()),
]
