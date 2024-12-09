"""
Test cases for User serializers
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer, ProfileSerializer
from users.models import Profile

User = get_user_model()

class UserSerializerTests(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.serializer = UserSerializer(instance=self.user)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            ['id', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'profile']
        )

    def test_email_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['email'], self.user_data['email'])

class ProfileSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.profile = self.user.profile
        self.serializer = ProfileSerializer(instance=self.profile)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        expected_fields = [
            'id', 'user', 'bio', 'birth_date', 'location',
            'profile_image', 'favorite_genres', 'favorite_artists',
            'instagram', 'twitter', 'facebook', 'profile_privacy',
            'email_notifications', 'push_notifications'
        ]
        self.assertCountEqual(data.keys(), expected_fields)
