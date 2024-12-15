from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from users.models import Profile

User = get_user_model()

class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user.is_verified:
                raise serializers.ValidationError("Email is already verified.")
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if not user.is_verified:
                raise serializers.ValidationError("Please verify your email address first.")
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value

    def save(self):
        email = self.validated_data["email"]
        user = User.objects.get(email=email)
        
        # Generate password reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build reset URL (frontend URL)
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        
        # Send email
        subject = "Reset your HOY password"
        message = render_to_string('authentication/password_reset_email.html', {
            'user': user,
            'reset_url': reset_url,
            'site_name': 'HOY'
        })
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            html_message=message,
            fail_silently=False,
        )
        return True

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate_uid(self, value):
        try:
            uid = force_str(urlsafe_base64_decode(value))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid user ID"})
        return value

    def validate_token(self, value):
        try:
            user = User.objects.get(pk=self.initial_data['uid'])
        except User.DoesNotExist:
            raise serializers.ValidationError({"token": "Invalid user ID"})

        if not default_token_generator.check_token(user, value):
            raise serializers.ValidationError({"token": "Invalid or expired token"})
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def save(self):
        new_password = self.validated_data["new_password"]
        user = User.objects.get(pk=self.initial_data['uid'])
        user.set_password(new_password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_verified')
        read_only_fields = ('is_verified',)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'id', 'bio', 'birth_date', 'location', 'profile_image',
            'favorite_genres', 'favorite_artists', 'instagram', 'twitter',
            'facebook', 'profile_privacy', 'email_notifications',
            'push_notifications'
        )

class UserProfileSerializer(serializers.Serializer):
    user = UserSerializer()
    profile = ProfileSerializer()

    def to_representation(self, instance):
        return {
            'user': UserSerializer(instance['user']).data,
            'profile': ProfileSerializer(instance['profile']).data
        }
