"""
Root conftest.py with common fixtures for all tests
"""

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

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
def staff_data():
    return {
        'email': 'staff@example.com',
        'password': 'staffpass123',
        'first_name': 'Staff',
        'last_name': 'User',
        'is_staff': True
    }

@pytest.fixture
def create_user(user_data):
    def _create_user(**kwargs):
        data = {**user_data}
        data.update(kwargs)
        return User.objects.create_user(**data)
    return _create_user

@pytest.fixture
def user(create_user):
    return create_user()

@pytest.fixture
def staff_user(staff_data, create_user):
    return create_user(**staff_data)

@pytest.fixture
def authenticated_client(api_client, user):
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client

@pytest.fixture
def staff_client(api_client, staff_user):
    refresh = RefreshToken.for_user(staff_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client
