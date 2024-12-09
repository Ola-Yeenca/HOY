"""
Test cases for User and Profile models
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from users.models import Profile

User = get_user_model()

class UserModelTests(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_create_user(self):
        self.assertEqual(self.user.email, self.user_data['email'])
        self.assertTrue(self.user.check_password(self.user_data['password']))
        self.assertTrue(self.user.is_active)
        self.assertFalse(self.user.is_staff)

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='admin123'
        )
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_staff)

    def test_user_profile_creation(self):
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertIsInstance(self.user.profile, Profile)

    def test_user_str(self):
        expected = f"{self.user.first_name} {self.user.last_name}"
        self.assertEqual(str(self.user), expected.strip())

class TestProfileModel(TestCase):
    def test_profile_creation(self):
        """Test that profile is created automatically"""
        user = User.objects.create_user(email='test@example.com', password='test123')
        assert Profile.objects.count() == 1
        assert Profile.objects.first().user == user

    def test_profile_str(self):
        """Test the string representation of profile"""
        user = User.objects.create_user(email='test@example.com', password='test123', first_name='Test', last_name='User')
        profile = user.profile
        expected_str = f"Profile for {user.get_full_name()}"
        assert str(profile) == expected_str
