import pytest
from django.utils import timezone
from datetime import timedelta
from feedback.models import Survey, SurveyResponse, Feedback, FeedbackResponse

pytestmark = pytest.mark.django_db

class TestSurveyModel:
    def test_survey_creation(self, survey):
        assert survey.title == 'Test Survey'
        assert survey.survey_type == 'event'
        assert survey.is_active is True
        assert len(survey.questions) == 3

    def test_survey_str(self, survey):
        assert str(survey) == 'Test Survey'

    def test_survey_is_active_for_user(self, survey):
        assert survey.is_active_for_user() is True
        
        # Test inactive survey
        survey.is_active = False
        survey.save()
        assert survey.is_active_for_user() is False
        
        # Test expired survey
        survey.is_active = True
        survey.end_date = timezone.now() - timedelta(days=1)
        survey.save()
        assert survey.is_active_for_user() is False

class TestSurveyResponseModel:
    def test_survey_response_creation(self, survey, user):
        response_data = {
            '1': 'Very Satisfied',
            '2': 5,
            '3': 'Great event!'
        }
        
        response = SurveyResponse.objects.create(
            survey=survey,
            user=user,
            responses=response_data
        )
        
        assert response.survey == survey
        assert response.user == user
        assert response.responses == response_data

    def test_survey_response_str(self, survey, user):
        response = SurveyResponse.objects.create(
            survey=survey,
            user=user,
            responses={}
        )
        expected_str = f'Response to {survey.title} by {user.get_full_name()}'
        assert str(response) == expected_str

class TestFeedbackModel:
    def test_feedback_creation(self, feedback):
        assert feedback.subject == 'Test Feedback'
        assert feedback.feedback_type == 'general'
        assert feedback.status == 'pending'
        assert feedback.rating == 4

    def test_feedback_str(self, feedback):
        expected_str = f'Feedback: {feedback.subject} ({feedback.get_status_display()})'
        assert str(feedback) == expected_str

    def test_feedback_status_transitions(self, feedback):
        # Test initial status
        assert feedback.status == 'pending'
        
        # Test status update
        feedback.status = 'in_progress'
        feedback.save()
        assert feedback.status == 'in_progress'
        
        # Test resolution
        feedback.status = 'resolved'
        feedback.save()
        assert feedback.status == 'resolved'

class TestFeedbackResponseModel:
    def test_feedback_response_creation(self, feedback, staff_user):
        response = FeedbackResponse.objects.create(
            feedback=feedback,
            responder=staff_user,
            message='Thank you for your feedback',
            is_internal=False
        )
        
        assert response.feedback == feedback
        assert response.responder == staff_user
        assert response.message == 'Thank you for your feedback'
        assert response.is_internal is False

    def test_feedback_response_str(self, feedback, staff_user):
        response = FeedbackResponse.objects.create(
            feedback=feedback,
            responder=staff_user,
            message='Test response'
        )
        expected_str = f'Response to {feedback.subject} by {staff_user.get_full_name()}'
        assert str(response) == expected_str

    def test_internal_response(self, feedback, staff_user):
        response = FeedbackResponse.objects.create(
            feedback=feedback,
            responder=staff_user,
            message='Internal note',
            is_internal=True
        )
        
        assert response.is_internal is True
