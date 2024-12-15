from django.urls import path
from .views import (
    EmailVerificationView,
    PasswordResetView,
    PasswordResetConfirmView,
    UserProfileView,
)

urlpatterns = [
    path('verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
