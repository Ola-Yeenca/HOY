import pytest
from django.core import mail
from django.conf import settings
from feedback.models import Feedback, FeedbackResponse

pytestmark = pytest.mark.django_db

@pytest.fixture
def enable_email_settings(settings):
    settings.STAFF_NOTIFICATION_EMAIL = 'staff@example.com'
    settings.DEFAULT_FROM_EMAIL = 'noreply@example.com'
    settings.ADMIN_URL = 'http://example.com/admin/'
    return settings

class TestFeedbackSignals:
    def test_new_feedback_notification(self, enable_email_settings, feedback):
        """Test that staff is notified when new feedback is created."""
        assert len(mail.outbox) == 1
        email = mail.outbox[0]
        
        assert email.subject == f'New Feedback: {feedback.subject}'
        assert email.to == [settings.STAFF_NOTIFICATION_EMAIL]
        
        # Check that both HTML and text versions are sent
        assert len(email.alternatives) == 1
        assert 'text/html' in email.alternatives[0][1]
        
        # Check email content
        assert feedback.subject in email.body
        assert feedback.message in email.body
        assert feedback.user.get_full_name() in email.body
        
        # Check HTML content
        html_content = email.alternatives[0][0]
        assert feedback.subject in html_content
        assert feedback.message in html_content
        assert feedback.user.get_full_name() in html_content

    def test_feedback_response_notification(self, enable_email_settings, feedback, staff_user):
        """Test that user is notified when their feedback receives a response."""
        # Clear the email outbox from feedback creation notification
        mail.outbox = []
        
        # Create a response
        response = FeedbackResponse.objects.create(
            feedback=feedback,
            responder=staff_user,
            message='Thank you for your feedback!',
            is_internal=False
        )
        
        assert len(mail.outbox) == 1
        email = mail.outbox[0]
        
        assert email.subject == f'Response to your feedback: {feedback.subject}'
        assert email.to == [feedback.user.email]
        
        # Check that both HTML and text versions are sent
        assert len(email.alternatives) == 1
        assert 'text/html' in email.alternatives[0][1]
        
        # Check email content
        assert feedback.subject in email.body
        assert response.message in email.body
        assert staff_user.get_full_name() in email.body
        
        # Check HTML content
        html_content = email.alternatives[0][0]
        assert feedback.subject in html_content
        assert response.message in html_content
        assert staff_user.get_full_name() in html_content

    def test_internal_response_no_notification(self, enable_email_settings, feedback, staff_user):
        """Test that user is not notified for internal responses."""
        # Clear the email outbox from feedback creation notification
        mail.outbox = []
        
        # Create an internal response
        FeedbackResponse.objects.create(
            feedback=feedback,
            responder=staff_user,
            message='Internal note',
            is_internal=True
        )
        
        # No email should be sent for internal responses
        assert len(mail.outbox) == 0

    def test_no_notification_without_email_settings(self, feedback, staff_user):
        """Test that no errors occur when email settings are not configured."""
        # Clear the email outbox
        mail.outbox = []
        
        # Create a response without email settings configured
        FeedbackResponse.objects.create(
            feedback=feedback,
            responder=staff_user,
            message='Thank you for your feedback!',
            is_internal=False
        )
        
        # No emails should be sent, but no errors should occur
        assert len(mail.outbox) == 0
