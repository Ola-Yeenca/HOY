import pytest
from django.test import RequestFactory
from feedback.serializers import (
    SurveySerializer,
    SurveyResponseSerializer,
    FeedbackSerializer,
    FeedbackResponseSerializer,
    SurveyAnalyticsSerializer
)

pytestmark = pytest.mark.django_db

class TestSurveySerializer:
    def test_survey_serialization(self, survey, user):
        request = RequestFactory().get('/')
        request.user = user
        
        serializer = SurveySerializer(survey, context={'request': request})
        data = serializer.data
        
        assert data['title'] == survey.title
        assert data['survey_type'] == survey.survey_type
        assert data['questions'] == survey.questions
        assert data['responses_count'] == 0
        assert data['has_user_responded'] is False

    def test_survey_deserialization(self, staff_user):
        data = {
            'title': 'New Survey',
            'description': 'Test Description',
            'survey_type': 'event',
            'is_active': True,
            'questions': [
                {
                    'id': 1,
                    'type': 'text',
                    'question': 'Test Question'
                }
            ]
        }
        
        serializer = SurveySerializer(data=data)
        assert serializer.is_valid()

class TestSurveyResponseSerializer:
    def test_survey_response_serialization(self, survey, user):
        response_data = {
            '1': 'Very Satisfied',
            '2': 5,
            '3': 'Great event!'
        }
        
        survey_response = survey.responses.create(
            user=user,
            responses=response_data
        )
        
        serializer = SurveyResponseSerializer(survey_response)
        data = serializer.data
        
        assert data['survey'] == survey_response.survey.id
        assert data['responses'] == response_data

    def test_survey_response_deserialization(self, survey, user):
        data = {
            'survey': survey.id,
            'responses': {
                '1': 'Satisfied',
                '2': 4,
                '3': 'Good experience'
            }
        }
        
        request = RequestFactory().post('/')
        request.user = user
        
        serializer = SurveyResponseSerializer(data=data, context={'request': request})
        assert serializer.is_valid()

class TestFeedbackSerializer:
    def test_feedback_serialization(self, feedback):
        serializer = FeedbackSerializer(feedback)
        data = serializer.data
        
        assert data['subject'] == feedback.subject
        assert data['message'] == feedback.message
        assert data['feedback_type'] == feedback.feedback_type
        assert data['status'] == feedback.status
        assert data['rating'] == feedback.rating
        assert data['user_name'] == feedback.user.get_full_name()
        assert data['event_title'] == feedback.event.title
        assert data['dj_name'] == feedback.dj.artist_name

    def test_feedback_deserialization(self, user, event, dj):
        data = {
            'subject': 'New Feedback',
            'message': 'Test Message',
            'feedback_type': 'event',
            'event': event.id,
            'dj': dj.id,
            'rating': 5
        }
        
        request = RequestFactory().post('/')
        request.user = user
        
        serializer = FeedbackSerializer(data=data, context={'request': request})
        assert serializer.is_valid()

class TestFeedbackResponseSerializer:
    def test_feedback_response_serialization(self, feedback, staff_user):
        response = feedback.responses.create(
            responder=staff_user,
            message='Thank you for your feedback',
            is_internal=False
        )
        
        serializer = FeedbackResponseSerializer(response)
        data = serializer.data
        
        assert data['message'] == response.message
        assert data['is_internal'] == response.is_internal
        assert data['responder_name'] == staff_user.get_full_name()

    def test_feedback_response_deserialization(self, feedback):
        data = {
            'feedback': feedback.id,
            'message': 'New Response',
            'is_internal': True
        }
        
        serializer = FeedbackResponseSerializer(data=data)
        assert serializer.is_valid()

class TestSurveyAnalyticsSerializer:
    def test_survey_analytics(self, survey, user):
        # Create multiple responses
        responses = [
            {'1': 'Very Satisfied', '2': 5, '3': 'Great!'},
            {'1': 'Satisfied', '2': 4, '3': 'Good'},
            {'1': 'Very Satisfied', '2': 5, '3': 'Excellent'}
        ]
        
        for response_data in responses:
            survey.responses.create(
                user=user,
                responses=response_data
            )
        
        serializer = SurveyAnalyticsSerializer(survey)
        data = serializer.data
        
        analytics = data['response_data']
        
        # Check multiple choice question analytics
        assert analytics['1']['Very Satisfied'] == 2
        assert analytics['1']['Satisfied'] == 1
        
        # Check rating question analytics
        assert analytics['2']['average'] == 4.67
        assert analytics['2']['count'] == 3
        
        # Check text question analytics
        assert analytics['3']['response_count'] == 3
