from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView as SimpleJWTTokenRefreshView,
)
from .views import (
    EmailVerificationView,
    PasswordResetView,
    PasswordResetConfirmView,
    UserProfileView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Token management
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # User authentication
    path('verify-email/', EmailVerificationView.as_view(), name='verify_email'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]
