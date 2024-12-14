from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .models import Profile, UserSettings
from datetime import date

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'is_active', 'date_joined', 'profile')
        extra_kwargs = {
            'password': {'write_only': True}
        }
        read_only_fields = ('id', 'date_joined')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    birth_date_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'birth_date', 'birth_date_display', 'location',
            'profile_image', 'favorite_genres', 'favorite_artists',
            'instagram', 'twitter', 'facebook',
            'show_email', 'show_location', 'show_birth_date',
            'show_social_links', 'show_genres', 'show_artists'
        ]
        
    def get_birth_date_display(self, obj):
        if obj.birth_date and obj.show_birth_date:
            return obj.birth_date.strftime('%B %d')
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        is_owner = request and request.user == instance.user

        if not is_owner:
            # Remove private information based on privacy settings
            if not instance.show_email:
                data['user']['email'] = None
            if not instance.show_location:
                data['location'] = None
            if not instance.show_birth_date:
                data['birth_date_display'] = None
            if not instance.show_social_links:
                data['instagram'] = None
                data['twitter'] = None
                data['facebook'] = None
            if not instance.show_genres:
                data['favorite_genres'] = None
            if not instance.show_artists:
                data['favorite_artists'] = None

        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                              email=email, password=password)
            if not user:
                if User.objects.filter(email=email).exists():
                    msg = 'Password is incorrect.'
                else:
                    msg = 'No account found with this email address.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        data['user'] = user
        return data

class SocialAuthSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=['google', 'apple'])
    access_token = serializers.CharField()
    id_token = serializers.CharField(required=False)  # Required for Apple Sign In

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        
        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        
        return attrs

class PhoneVerificationSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=True)

class PhoneVerificationConfirmSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=True)
    verification_code = serializers.CharField(required=True)

class EmailVerificationSerializer(serializers.Serializer):
    """Serializer for email verification."""
    token = serializers.CharField(required=True)
    uidb64 = serializers.CharField(required=True)

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Profile
        fields = (
            'first_name', 'last_name', 'bio', 'birth_date', 'location',
            'favorite_genres', 'favorite_artists', 'instagram', 'twitter',
            'facebook', 'show_email', 'show_location', 'show_birth_date',
            'show_social_links', 'show_genres', 'show_artists', 'phone_number'
        )

    def validate_birth_date(self, value):
        # Validate that the user is at least 18 years old.
        if value:
            today = date.today()
            age = (today.year - value.year - 
                   ((today.month, today.day) < 
                    (value.month, value.day)))
            if age < 18:
                raise serializers.ValidationError("Must be at least 18 years old.")
        return value

    def validate_phone_number(self, value):
        # Validate phone number format.
        if value and not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        return value

    def update(self, instance, validated_data):
        # Update user profile and related user instance.
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'email_notifications',
            'event_reminders',
            'profile_visibility',
            'marketing_emails',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
