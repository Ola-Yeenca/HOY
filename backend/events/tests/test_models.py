import pytest
from django.contrib.auth import get_user_model
from events.models import Event, DJ, EventInteraction
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

@pytest.mark.django_db
class TestEventModel:
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

    def test_event_creation(self, event):
        assert str(event) == 'Test Event'
        assert event.status == 'SCHEDULED'
        assert event.capacity == 100
        assert event.price == 50.00

    def test_event_date_validation(self, dj):
        # Test past date
        with pytest.raises(ValueError):
            Event.objects.create(
                title='Past Event',
                description='Test Description',
                dj=dj,
                date=timezone.now().date() - timedelta(days=1),
                start_time=timezone.now().time(),
                venue='Test Venue',
                capacity=100,
                price=50.00,
                status='SCHEDULED'
            )

    def test_event_time_validation(self, dj):
        # Test end time before start time
        with pytest.raises(ValueError):
            Event.objects.create(
                title='Invalid Time Event',
                description='Test Description',
                dj=dj,
                date=timezone.now().date() + timedelta(days=1),
                start_time=(timezone.now() + timedelta(hours=2)).time(),
                venue='Test Venue',
                capacity=100,
                price=50.00,
                status='SCHEDULED'
            )

@pytest.mark.django_db
class TestDJModel:
    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email='dj@example.com',
            password='testpass123'
        )

    def test_dj_creation(self, user):
        dj = DJ.objects.create(
            user=user,
            stage_name='DJ Test',
            bio='Test bio',
            genre_specialization=['House', 'Techno']
        )
        assert str(dj) == 'DJ Test'
        assert dj.user == user
        assert dj.genre_specialization == ['House', 'Techno']

@pytest.mark.django_db
class TestEventInteractionModel:
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

    def test_event_interaction(self, user, event):
        interaction = EventInteraction.objects.create(
            user=user,
            event=event,
            interaction_type='INTERESTED'
        )
        assert str(interaction) == f'{user.email} - {event.title} - INTERESTED'
        assert interaction.user == user
        assert interaction.event == event
