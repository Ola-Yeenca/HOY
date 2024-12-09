from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleryViewSet, ImageViewSet

router = DefaultRouter()
router.register(r'galleries', GalleryViewSet)
router.register(r'images', ImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
