from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import (
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    UserProfileSerializer,
    EmailVerificationSerializer,
)
from .services import send_verification_email, verify_email, send_password_reset_email, reset_password
from .token_service import refresh_tokens, verify_token, should_refresh_token
from django.shortcuts import get_object_or_404
from .models import User

class EmailVerificationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailVerificationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = get_object_or_404(User, email=email)
            
            try:
                send_verification_email(user)
                return Response(
                    {"detail": "Verification email has been sent."},
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {"detail": "Failed to send verification email."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        token = request.query_params.get('token')
        if not token:
            return Response(
                {"detail": "Verification token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        success, message = verify_email(token)
        if success:
            return Response(
                {"detail": message},
                status=status.HTTP_200_OK
            )
        return Response(
            {"detail": message},
            status=status.HTTP_400_BAD_REQUEST
        )

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = get_object_or_404(User, email=email)
            
            try:
                send_password_reset_email(user)
                return Response(
                    {"detail": "Password reset email has been sent."},
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {"detail": "Failed to send reset email."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            success, message = reset_password(token, new_password)
            if success:
                return Response(
                    {"detail": message},
                    status=status.HTTP_200_OK
                )
            return Response(
                {"detail": message},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the refresh token
            is_valid, message = verify_token(refresh_token)
            if not is_valid:
                return Response(
                    {"detail": message},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Generate new tokens
            tokens = refresh_tokens(refresh_token)
            return Response(tokens, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"detail": "Token refresh failed."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TokenVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        if not token:
            return Response(
                {"detail": "Token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_valid, message = verify_token(token)
        if is_valid:
            return Response({"detail": message}, status=status.HTTP_200_OK)
        return Response({"detail": message}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            profile = user.profile
            serializer = self.serializer_class({
                'user': user,
                'profile': profile
            })
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
