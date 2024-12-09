import pytest
from django.urls import reverse
from rest_framework import status
from feedback.models import Survey, SurveyResponse, Feedback, FeedbackResponse

pytestmark = pytest.mark.django_db

class TestSurveyViewSet:
    def test_list_surveys(self, authenticated_client, survey):
        url = reverse('survey-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == survey.title

    def test_create_survey_staff_only(self, authenticated_client, staff_client):
        url = reverse('survey-list')
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
        
        # Regular user cannot create survey
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
        # Staff can create survey
        response = staff_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Survey'

    def test_survey_analytics(self, staff_client, authenticated_client, survey, user):
        # Create some responses
        response_data = {'1': 'Very Satisfied', '2': 5, '3': 'Great!'}
        SurveyResponse.objects.create(survey=survey, user=user, responses=response_data)
        
        url = reverse('survey-analytics', args=[survey.id])
        
        # Regular user cannot view analytics
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
        # Staff can view analytics
        response = staff_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert 'response_data' in response.data

class TestSurveyResponseViewSet:
    def test_create_survey_response(self, authenticated_client, survey):
        url = reverse('surveyresponse-list')
        data = {
            'survey': survey.id,
            'responses': {
                '1': 'Very Satisfied',
                '2': 5,
                '3': 'Excellent event!'
            }
        }
        
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['responses'] == data['responses']

    def test_user_can_only_view_own_responses(self, authenticated_client, survey, user):
        # Create responses for user
        response_data = {'1': 'Satisfied', '2': 4, '3': 'Good'}
        SurveyResponse.objects.create(survey=survey, user=user, responses=response_data)
        
        url = reverse('surveyresponse-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

class TestFeedbackViewSet:
    def test_create_feedback(self, authenticated_client, event, dj):
        url = reverse('feedback-list')
        data = {
            'subject': 'Event Feedback',
            'message': 'Great event!',
            'feedback_type': 'event',
            'event': event.id,
            'dj': dj.id,
            'rating': 5
        }
        
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['subject'] == data['subject']

    def test_staff_response_to_feedback(self, staff_client, feedback):
        url = reverse('feedback-respond', args=[feedback.id])
        data = {
            'message': 'Thank you for your feedback!',
            'is_internal': False
        }
        
        response = staff_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert FeedbackResponse.objects.count() == 1
        assert feedback.responses.first().message == data['message']

    def test_update_feedback_status(self, staff_client, authenticated_client, feedback):
        url = reverse('feedback-update-status', args=[feedback.id])
        data = {'status': 'in_progress'}
        
        # Regular user cannot update status
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
        # Staff can update status
        response = staff_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        feedback.refresh_from_db()
        assert feedback.status == 'in_progress'

    def test_feedback_statistics(self, staff_client, authenticated_client, feedback):
        url = reverse('feedback-statistics')
        
        # Regular user cannot view statistics
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
        # Staff can view statistics
        response = staff_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert 'total_count' in response.data
        assert 'by_type' in response.data
        assert 'by_status' in response.data
        assert 'average_rating' in response.data
