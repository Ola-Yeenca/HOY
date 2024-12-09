from rest_framework import serializers, viewsets, status, generics, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
import jwt
import requests
from datetime import datetime, timedelta
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db.models import Q
from django.contrib.auth.models import User
import logging
from .models import Profile, UserSettings
from .serializers import (
    UserSerializer, UserRegistrationSerializer, SocialAuthSerializer,
    PhoneVerificationSerializer, EmailVerificationSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    ProfileSerializer, ProfileUpdateSerializer, UserLoginSerializer, PasswordChangeSerializer, PhoneVerificationConfirmSerializer,
    UserSettingsSerializer
)
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes, authentication_classes
import logging
logger = logging.getLogger(__name__)


User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter queryset to return only the authenticated user."""
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Return the authenticated user's details."""
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class EmailRegistrationView(generics.CreateAPIView):
    """View for email registration."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Create JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Get or create profile
            profile = Profile.objects.get_or_create(user=user)[0]
            profile_serializer = ProfileSerializer(profile, context={'request': request})
            
            return Response({
                'user': serializer.data,
                'profile': profile_serializer.data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
            
        except serializers.ValidationError as e:
            return Response({
                'error': 'Validation Error',
                'details': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Registration failed',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SocialAuthView(generics.GenericAPIView):
    """View for social authentication."""
    serializer_class = SocialAuthSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        provider = serializer.validated_data['provider']
        access_token = serializer.validated_data['access_token']
        
        if provider == 'google':
            return self._handle_google_auth(access_token)
        elif provider == 'apple':
            id_token = serializer.validated_data.get('id_token')
            return self._handle_apple_auth(access_token, id_token)
        
        return Response({
            'error': 'Invalid provider'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def _handle_google_auth(self, access_token):
        """Handle Google authentication."""
        try:
            response = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            if response.status_code != 200:
                return Response({
                    'error': 'Invalid token'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user_data = response.json()
            email = user_data['email']
            google_id = user_data['sub']
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'google_id': google_id,
                    'first_name': user_data.get('given_name', ''),
                    'last_name': user_data.get('family_name', ''),
                    'email_verified': True,
                }
            )
            
            if not created and not user.google_id:
                user.google_id = google_id
                user.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def _handle_apple_auth(self, access_token, id_token):
        """Handle Apple authentication."""
        try:
            decoded_token = jwt.decode(id_token, options={"verify_signature": False})
            email = decoded_token['email']
            apple_id = decoded_token['sub']
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'apple_id': apple_id,
                    'email_verified': True,
                }
            )
            
            if not created and not user.apple_id:
                user.apple_id = apple_id
                user.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class PhoneVerificationView(generics.GenericAPIView):
    """View for phone verification."""
    serializer_class = PhoneVerificationSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send_code(self, request):
        """Send verification code to phone number."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        # Implement SMS sending logic here using your preferred provider
        # For example, using Twilio:
        # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        # verification = client.verify.services(settings.TWILIO_VERIFY_SERVICE_SID) \
        #     .verifications.create(to=phone_number, channel='sms')
        
        return Response({
            'message': 'Verification code sent successfully'
        })

    @action(detail=False, methods=['post'])
    def verify(self, request):
        """Verify phone number with code."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        code = serializer.validated_data['verification_code']
        
        # Implement verification logic here
        # For example, using Twilio:
        # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        # try:
        #     verification_check = client.verify.services(settings.TWILIO_VERIFY_SERVICE_SID) \
        #         .verification_checks.create(to=phone_number, code=code)
        #     if verification_check.status == 'approved':
        #         user = request.user
        #         user.phone_number = phone_number
        #         user.phone_verified = True
        #         user.save()
        #         return Response({'message': 'Phone number verified successfully'})
        # except Exception as e:
        #     return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # For now, just mock the verification
        user = request.user
        user.phone_number = phone_number
        user.phone_verified = True
        user.save()
        
        return Response({
            'message': 'Phone number verified successfully'
        })

class EmailVerificationView(generics.GenericAPIView):
    """View for email verification."""
    serializer_class = EmailVerificationSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        """Verify email with token."""
        try:
            uid = force_str(urlsafe_base64_decode(request.data.get('uid', '')))
            token = request.data.get('token', '')
            
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                user.email_verified = True
                user.save()
                return Response({
                    'message': 'Email verified successfully'
                })
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'error': 'Invalid uid'
            }, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(generics.GenericAPIView):
    """View for password reset request."""
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        """Send password reset email."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        
        send_mail(
            'Reset your password',
            f'Click this link to reset your password: {reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Password reset email sent'
        })

class PasswordResetConfirmView(generics.GenericAPIView):
    """View for password reset confirmation."""
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        """Reset password with token."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            uid = force_str(urlsafe_base64_decode(request.data.get('uid', '')))
            token = serializer.validated_data['token']
            password = serializer.validated_data['password']
            
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({
                    'message': 'Password reset successful'
                })
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'error': 'Invalid uid'
            }, status=status.HTTP_400_BAD_REQUEST)

class ProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for Profile model."""
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'post', 'delete']

    def get_queryset(self):
        """Filter queryset to return only profiles that are visible to the user."""
        user = self.request.user
        if user.is_staff:
            return Profile.objects.all()
        return Profile.objects.filter(
            Q(user=user) |
            Q(profile_privacy='public') |
            (Q(profile_privacy='friends') & Q(user__in=user.friends.all()))
        )

    def get_serializer_class(self):
        """Return appropriate serializer class based on action."""
        if self.action in ['update', 'partial_update']:
            return ProfileUpdateSerializer
        return ProfileSerializer

    def get_object(self):
        """Return the authenticated user's profile for update operations."""
        if self.action in ['update', 'partial_update', 'image', 'remove_image']:
            return self.request.user.profile
        return super().get_object()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Return the authenticated user's profile."""
        serializer = self.get_serializer(request.user.profile)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def image(self, request):
        """Upload profile image."""
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = self.get_object()
        # Delete old image if it exists
        if profile.profile_image:
            profile.profile_image.delete(save=False)
            
        profile.profile_image = request.FILES['image']
        profile.save()
        
        return Response({
            'message': 'Profile image updated successfully',
            'image_url': profile.profile_image.url if profile.profile_image else None
        })

    @action(detail=False, methods=['delete'])
    def remove_image(self, request):
        """Remove profile image."""
        profile = self.get_object()
        if profile.profile_image:
            profile.profile_image.delete()
            profile.save()
            return Response({'message': 'Profile image removed successfully'})
        return Response({'message': 'No profile image to remove'})

class UserSettingsViewSet(mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         viewsets.GenericViewSet):
    """ViewSet for user settings."""
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    def get_object(self):
        """Get or create settings for the authenticated user."""
        settings, created = UserSettings.objects.get_or_create(user=self.request.user)
        return settings

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user's settings."""
        settings = self.get_object()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_me(self, request):
        """Update the current user's settings."""
        settings = self.get_object()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []

    @method_decorator(ensure_csrf_cookie)
    @action(detail=False, methods=['get'])
    def csrf(self, request):
        """Get CSRF token."""
        return Response({'detail': 'CSRF cookie set'})

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user."""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Specify the authentication backend
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            refresh = RefreshToken.for_user(user)
            
            profile = Profile.objects.get_or_create(user=user)[0]
            
            return Response({
                'user': UserSerializer(user).data,
                'profile': ProfileSerializer(profile).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Authenticate a user and return tokens."""
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # Specify the authentication backend
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            refresh = RefreshToken.for_user(user)
            
            profile = Profile.objects.get_or_create(user=user)[0]
            
            return Response({
                'user': UserSerializer(user).data,
                'profile': ProfileSerializer(profile).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """
        Blacklist the refresh token.
        """
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response(status=status.HTTP_205_RESET_CONTENT)
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get the current user's details.
        """
        serializer = UserSerializer(request.user)
        profile = Profile.objects.get_or_create(user=request.user)[0]
        return Response({
            'user': serializer.data,
            'profile': ProfileSerializer(profile).data
        })

# Standalone CSRF endpoint as a backup
@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'detail': 'CSRF cookie set'})
