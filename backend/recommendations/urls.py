from django.urls import path
from .views import (
    EventRecommendationView,
    MusicRecommendationView,
    TrainModelView
)

urlpatterns = [
    path('events/', EventRecommendationView.as_view(), name='event-recommendations'),
    path('music/', MusicRecommendationView.as_view(), name='music-recommendations'),
    path('train/', TrainModelView.as_view(), name='train-model'),
]
