import pytest
from django.contrib.auth import get_user_model
from events.models import Event, DJ, EventInteraction
from events.serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    DJSerializer,
    EventInteractionSerializer
)
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

@pytest.mark.django_db
class TestEventSerializer:
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
            stage_name='DJ Test',
            bio='Test bio'
        )

    @pytest.fixture
    def event_data(self, dj):
        return {
            'title': 'Test Event',
            'description': 'Test Description',
            'dj': str(dj.id),
            'date': (timezone.now().date() + timedelta(days=1)).isoformat(),
            'start_time': timezone.now().time().isoformat(),
            'end_time': (timezone.now() + timedelta(hours=2)).time().isoformat(),
            'venue': 'Test Venue',
            'capacity': 100,
            'price': '50.00',
            'status': 'SCHEDULED'
        }

    def test_serialize_event(self, dj):
        event = Event.objects.create(
            title='Test Event',
            description='Test Description',
            dj=dj,
            date=timezone.now().date() + timedelta(days=1),
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timedelta(hours=2)).time(),
            venue='Test Venue',
            capacity=100,
            price=50.00,
            status='SCHEDULED'
        )
        
        serializer = EventListSerializer(event)
        data = serializer.data
        
        assert data['title'] == 'Test Event'
        assert data['description'] == 'Test Description'
        assert data['venue'] == 'Test Venue'
        assert float(data['price']) == 50.00

    def test_deserialize_event(self, event_data):
        serializer = EventCreateUpdateSerializer(data=event_data)
        assert serializer.is_valid()
        event = serializer.save()
        assert event.title == event_data['title']
        assert event.venue == event_data['venue']
        assert float(event.price) == float(event_data['price'])

@pytest.mark.django_db
class TestDJSerializer:
    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email='dj@example.com',
            password='testpass123'
        )

    @pytest.fixture
    def dj_data(self, user):
        return {
            'user': str(user.id),
            'stage_name': 'DJ Test',
            'bio': 'Test bio',
            'genre_specialization': ['House', 'Techno'],
            'years_of_experience': 5
        }

    def test_serialize_dj(self, user):
        dj = DJ.objects.create(
            user=user,
            stage_name='DJ Test',
            bio='Test bio',
            genre_specialization=['House', 'Techno']
        )
        
        serializer = DJSerializer(dj)
        data = serializer.data
        
        assert data['stage_name'] == 'DJ Test'
        assert data['bio'] == 'Test bio'
        assert data['genre_specialization'] == ['House', 'Techno']

    def test_deserialize_dj(self, dj_data):
        serializer = DJSerializer(data=dj_data)
        assert serializer.is_valid()
        dj = serializer.save()
        assert dj.stage_name == dj_data['stage_name']
        assert dj.genre_specialization == dj_data['genre_specialization']

@pytest.mark.django_db
class TestEventInteractionSerializer:
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
            end_time=(timezone.now() + timedelta(hours=2)).time(),
            venue='Test Venue',
            capacity=100,
            price=50.00,
            status='SCHEDULED'
        )

    @pytest.fixture
    def interaction_data(self, user, event):
        return {
            'user': str(user.id),
            'event': str(event.id),
            'interaction_type': 'INTERESTED'
        }

    def test_serialize_interaction(self, user, event):
        interaction = EventInteraction.objects.create(
            user=user,
            event=event,
            interaction_type='INTERESTED'
        )
        
        serializer = EventInteractionSerializer(interaction)
        data = serializer.data
        
        assert data['interaction_type'] == 'INTERESTED'
        assert data['user'] == str(user.id)
        assert data['event'] == str(event.id)

    def test_deserialize_interaction(self, interaction_data):
        serializer = EventInteractionSerializer(data=interaction_data)
        assert serializer.is_valid()
        interaction = serializer.save()
        assert interaction.interaction_type == interaction_data['interaction_type']
