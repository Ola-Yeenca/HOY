from django.core import mail
from django.test import TestCase
from django.conf import settings
from authentication.services import send_verification_email, send_password_reset_email
from authentication.models import User

class EmailTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_verification_email(self):
        send_verification_email(self.user)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Verify your email address')
        self.assertEqual(mail.outbox[0].from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(mail.outbox[0].to, [self.user.email])

    def test_password_reset_email(self):
        send_password_reset_email(self.user)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Reset your password')
        self.assertEqual(mail.outbox[0].from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
