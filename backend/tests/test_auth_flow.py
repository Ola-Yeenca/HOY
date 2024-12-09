import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from users.models import Profile
import json

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user_data():
    return {
        'email': 'test@example.com',
        'password': 'testpass123',
        'password_confirm': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }

@pytest.mark.django_db
class TestAuthFlow:
    def test_complete_auth_flow(self, api_client, test_user_data):
        """Test the complete authentication flow."""
        
        # 1. Get CSRF token
        csrf_url = reverse('auth-csrf')
        csrf_response = api_client.get(csrf_url)
        print("CSRF Response:", csrf_response.content.decode())
        assert csrf_response.status_code == status.HTTP_200_OK
        
        # Set CSRF token in client
        csrf_token = csrf_response.cookies.get('csrftoken')
        if csrf_token:
            api_client.defaults['HTTP_X_CSRFTOKEN'] = csrf_token.value
        
        # 2. Register new user
        register_url = reverse('auth-register')
        try:
            response = api_client.post(register_url, test_user_data)
            print("Registration Response:", response.content.decode())
            assert response.status_code == status.HTTP_201_CREATED
            
            response_data = response.json()
            assert 'user' in response_data
            assert 'profile' in response_data
            assert 'tokens' in response_data
            
            # Save tokens
            access_token = response_data['tokens']['access']
            refresh_token = response_data['tokens']['refresh']
            
        except Exception as e:
            print("Registration Error:", str(e))
            print("Response Content:", getattr(response, 'content', b'').decode())
            raise
        
        # 3. Login with credentials
        login_url = reverse('auth-login')
        login_data = {
            'email': test_user_data['email'],
            'password': test_user_data['password']
        }
        try:
            response = api_client.post(login_url, login_data)
            print("Login Response:", response.content.decode())
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert response_data['status'] == 'success'
            assert 'tokens' in response_data.get('data', {})
            
        except Exception as e:
            print("Login Error:", str(e))
            print("Response Content:", getattr(response, 'content', b'').decode())
            raise
        
        # 4. Access protected endpoint (me)
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        me_url = reverse('auth-me')
        try:
            response = api_client.get(me_url)
            print("Me Response:", response.content.decode())
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert response_data['user']['email'] == test_user_data['email']
            
        except Exception as e:
            print("Me Endpoint Error:", str(e))
            print("Response Content:", getattr(response, 'content', b'').decode())
            raise
        
        # 5. Update profile
        profile_id = response_data['profile']['id']
        profile_url = reverse('profile-detail', args=[profile_id])
        profile_data = {
            'bio': 'Test bio',
            'location': 'Test City',
            'favorite_genres': ['Rock', 'Jazz'],
            'favorite_artists': ['Artist 1', 'Artist 2']
        }
        try:
            response = api_client.patch(profile_url, profile_data)
            print("Profile Update Response:", response.content.decode())
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert response_data['bio'] == profile_data['bio']
            
        except Exception as e:
            print("Profile Update Error:", str(e))
            print("Response Content:", getattr(response, 'content', b'').decode())
            raise
        
        # 6. Test token refresh
        refresh_url = reverse('token_refresh')
        refresh_data = {'refresh': refresh_token}
        try:
            response = api_client.post(refresh_url, refresh_data)
            print("Token Refresh Response:", response.content.decode())
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert 'access' in response_data
            
        except Exception as e:
            print("Token Refresh Error:", str(e))
            print("Response Content:", getattr(response, 'content', b'').decode())
            raise
        
        # 7. Logout
        logout_url = reverse('auth-logout')
        try:
            response = api_client.post(logout_url)
            print("Logout Response:", response.content.decode())
            assert response.status_code == status.HTTP_200_OK
            
        except Exception as e:
            print("Logout Error:", str(e))
            print("Response Content:", getattr(response, 'content', b'').decode())
            raise
        
        # 8. View events
        events_url = reverse('event-list')
        response = api_client.get(events_url)
        assert response.status_code == status.HTTP_200_OK
