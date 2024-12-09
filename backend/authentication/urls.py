from django.urls import path
from .views import (
    PasswordResetView,
    PasswordResetConfirmView,
    UserProfileView,
)

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('reset-password/', PasswordResetView.as_view(), name='password_reset'),
    path('reset-password/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
