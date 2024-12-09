from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SurveyViewSet, SurveyResponseViewSet, FeedbackViewSet

router = DefaultRouter()
router.register(r'surveys', SurveyViewSet)
router.register(r'survey-responses', SurveyResponseViewSet)
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
