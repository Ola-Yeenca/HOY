import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from events.models import Event, DJ, EventInteraction
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.mark.django_db
class TestEventViews:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    @pytest.fixture
    def dj_user(self):
        return User.objects.create_user(
            email='dj@example.com',
            password='testpass123'
        )

    @pytest.fixture
    def dj(self, dj_user):
        return DJ.objects.create(
            user=dj_user,
            stage_name='DJ Test',
            bio='Test bio'
        )

    @pytest.fixture
    def event(self, dj):
        return Event.objects.create(
            title='Test Event',
            description='Test Description',
            dj=dj,
            date=timezone.now().date() + timedelta(days=1),
            start_time=timezone.now().time(),
            venue='Test Venue',
            capacity=100,
            price=50.00,
            status='SCHEDULED'
        )

    @pytest.fixture
    def auth_client(self, api_client, user):
        refresh = RefreshToken.for_user(user)
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        return api_client

    def test_list_events(self, api_client, event):
        url = reverse('event-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == 'Test Event'

    def test_retrieve_event(self, api_client, event):
        url = reverse('event-detail', kwargs={'pk': event.id})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Test Event'

    def test_create_event(self, auth_client, dj):
        url = reverse('event-list')
        data = {
            'title': 'New Event',
            'description': 'New Description',
            'dj': str(dj.id),
            'date': (timezone.now().date() + timedelta(days=1)).isoformat(),
            'start_time': timezone.now().time().isoformat(),
            'venue': 'New Venue',
            'capacity': 200,
            'price': '75.00',
            'status': 'SCHEDULED'
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Event'

    def test_update_event(self, auth_client, event):
        url = reverse('event-detail', kwargs={'pk': event.id})
        data = {
            'title': 'Updated Event',
            'capacity': 150
        }
        response = auth_client.patch(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Event'
        assert response.data['capacity'] == 150

@pytest.mark.django_db
class TestDJViews:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    @pytest.fixture
    def auth_client(self, api_client, user):
        refresh = RefreshToken.for_user(user)
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        return api_client

    def test_list_djs(self, api_client, user):
        DJ.objects.create(
            user=user,
            stage_name='DJ Test',
            bio='Test bio'
        )
        url = reverse('dj-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['stage_name'] == 'DJ Test'

    def test_create_dj(self, auth_client, user):
        url = reverse('dj-list')
        data = {
            'user': str(user.id),
            'stage_name': 'New DJ',
            'bio': 'New bio',
            'genre_specialization': ['House', 'Techno']
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['stage_name'] == 'New DJ'

@pytest.mark.django_db
class TestEventInteractionViews:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    @pytest.fixture
    def dj(self, user):
        return DJ.objects.create(
            user=user,
            stage_name='DJ Test'
        )

    @pytest.fixture
    def event(self, dj):
        return Event.objects.create(
            title='Test Event',
            description='Test Description',
            dj=dj,
            date=timezone.now().date() + timedelta(days=1),
            start_time=timezone.now().time(),
            venue='Test Venue',
            capacity=100,
            price=50.00,
            status='SCHEDULED'
        )

    @pytest.fixture
    def auth_client(self, api_client, user):
        refresh = RefreshToken.for_user(user)
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        return api_client

    def test_create_interaction(self, auth_client, user, event):
        url = reverse('eventinteraction-list')
        data = {
            'user': str(user.id),
            'event': str(event.id),
            'interaction_type': 'INTERESTED'
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['interaction_type'] == 'INTERESTED'

    def test_list_user_interactions(self, auth_client, user, event):
        EventInteraction.objects.create(
            user=user,
            event=event,
            interaction_type='INTERESTED'
        )
        url = reverse('eventinteraction-list')
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['interaction_type'] == 'INTERESTED'
