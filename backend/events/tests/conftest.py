import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from events.models import Event, DJ, EventInteraction
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user_data():
    return {
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }

@pytest.fixture
def dj_data():
    return {
        'stage_name': 'DJ Test',
        'bio': 'Test bio',
        'genre_specialization': ['House', 'Techno'],
        'years_of_experience': 5
    }

@pytest.fixture
def event_data(dj):
    return {
        'title': 'Test Event',
        'description': 'Test Description',
        'dj': str(dj.id),
        'date': (timezone.now().date() + timedelta(days=1)).isoformat(),
        'start_time': timezone.now().time().isoformat(),
        'venue': 'Test Venue',
        'capacity': 100,
        'price': '50.00',
        'status': 'SCHEDULED'
    }

@pytest.fixture
def create_user(user_data):
    def make_user(**kwargs):
        return User.objects.create_user(**{**user_data, **kwargs})
    return make_user

@pytest.fixture
def authenticated_user(create_user):
    return create_user()

@pytest.fixture
def auth_client(api_client, authenticated_user):
    refresh = RefreshToken.for_user(authenticated_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client

@pytest.fixture
def dj_user(create_user):
    return create_user(email='dj@example.com')

@pytest.fixture
def dj(dj_user, dj_data):
    return DJ.objects.create(user=dj_user, **dj_data)

@pytest.fixture
def event(dj, event_data):
    return Event.objects.create(
        title=event_data['title'],
        description=event_data['description'],
        dj=dj,
        date=timezone.now().date() + timedelta(days=1),
        start_time=timezone.now().time(),
        venue=event_data['venue'],
        capacity=event_data['capacity'],
        price=float(event_data['price']),
        status=event_data['status']
    )
