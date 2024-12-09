"""
Feedback-specific test fixtures.
Common fixtures are imported from root conftest.py
"""

import pytest
from django.utils import timezone
from datetime import timedelta
from events.models import Event, DJ
from feedback.models import Survey, Feedback, SurveyResponse, FeedbackResponse

@pytest.fixture
def dj(staff_user):
    """Create a DJ instance for testing."""
    return DJ.objects.create(
        user=staff_user,
        bio="Test DJ Bio",
        experience_years=5,
        hourly_rate=100.00
    )

@pytest.fixture
def event(dj):
    """Create an Event instance for testing."""
    return Event.objects.create(
        dj=dj,
        title="Test Event",
        description="Test Event Description",
        date=timezone.now() + timedelta(days=7),
        duration=timedelta(hours=4),
        location="Test Location",
        max_capacity=100
    )

@pytest.fixture
def survey(staff_user):
    """Create a Survey instance for testing."""
    return Survey.objects.create(
        created_by=staff_user,
        title="Test Survey",
        description="Test Survey Description",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=7),
        is_active=True,
        questions=[
            {
                "id": 1,
                "type": "multiple_choice",
                "text": "How satisfied were you?",
                "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
            },
            {
                "id": 2,
                "type": "text",
                "text": "Any additional comments?"
            }
        ]
    )

@pytest.fixture
def survey_response(survey, user):
    """Create a SurveyResponse instance for testing."""
    return SurveyResponse.objects.create(
        survey=survey,
        user=user,
        responses=[
            {"question_id": 1, "answer": "Very Satisfied"},
            {"question_id": 2, "answer": "Great experience!"}
        ]
    )

@pytest.fixture
def feedback(user, event, dj):
    """Create a Feedback instance for testing."""
    return Feedback.objects.create(
        user=user,
        event=event,
        dj=dj,
        rating=5,
        comment="Great performance!",
        is_anonymous=False
    )

@pytest.fixture
def feedback_response(feedback, staff_user):
    """Create a FeedbackResponse instance for testing."""
    return FeedbackResponse.objects.create(
        feedback=feedback,
        responder=staff_user,
        response="Thank you for your feedback!"
    )
