from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

router = DefaultRouter()
router.register(r'', views.UserViewSet, basename='user')
router.register(r'profiles', views.ProfileViewSet, basename='profile')
router.register(r'settings', views.UserSettingsViewSet, basename='settings')

# Create a separate router for auth endpoints
auth_router = DefaultRouter()
auth_router.register(r'auth', views.AuthViewSet, basename='auth')

urlpatterns = [
    # Authentication URLs with explicit method mapping
    path('auth/csrf/', views.AuthViewSet.as_view({
        'get': 'csrf'
    }), name='auth-csrf'),
    path('auth/register/', views.AuthViewSet.as_view({
        'post': 'register'
    }), name='auth-register'),
    path('auth/login/', views.AuthViewSet.as_view({
        'post': 'login'
    }), name='auth-login'),
    path('auth/logout/', views.AuthViewSet.as_view({
        'post': 'logout'
    }), name='auth-logout'),
    
    # JWT Token URLs
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Profile Image Upload URL - must be before router URLs
    path('profiles/me/image/', views.ProfileViewSet.as_view({
        'post': 'image',
        'delete': 'remove_image'
    }), name='profile-image'),
    
    # Router URLs - must be after specific URLs to avoid overriding
    path('', include(router.urls)),
    path('auth/', include(auth_router.urls)),
]
