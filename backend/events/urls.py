from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, DJViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'djs', DJViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
