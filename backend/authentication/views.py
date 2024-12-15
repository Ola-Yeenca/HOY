from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import (
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    UserProfileSerializer,
    EmailVerificationSerializer,
)
from .services import send_verification_email, verify_email, send_password_reset_email, reset_password
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
