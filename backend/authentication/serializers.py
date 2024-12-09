from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from users.models import Profile

User = get_user_model()

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
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
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid user ID"})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Invalid or expired token"})

        attrs['user'] = user
        return attrs

    def save(self):
        password = self.validated_data["password"]
        user = self.validated_data["user"]
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_email_verified')

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
