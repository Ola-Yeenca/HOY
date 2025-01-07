from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings
from django.utils import timezone
from datetime import timedelta
from .models import User

def generate_tokens(user):
    """
    Generate a new pair of access and refresh tokens for a user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'access_expires': timezone.now() + api_settings.ACCESS_TOKEN_LIFETIME,
        'refresh_expires': timezone.now() + api_settings.REFRESH_TOKEN_LIFETIME,
    }

def refresh_tokens(refresh_token):
    """
    Generate new access and refresh tokens using a refresh token.
    """
    try:
        refresh = RefreshToken(refresh_token)
        
        # Verify the token is not blacklisted
        if api_settings.BLACKLIST_AFTER_ROTATION:
            try:
                refresh.blacklist()
            except AttributeError:
                pass

        # Get the user from the token
        user_id = refresh.payload.get('user_id')
        user = User.objects.get(id=user_id)

        # Generate new tokens
        return generate_tokens(user)
    except TokenError as e:
        raise TokenError(str(e))
    except User.DoesNotExist:
        raise TokenError("User not found")

def verify_token(token):
    """
    Verify if a token is valid and not expired.
    """
    try:
        refresh = RefreshToken(token)
        # Check if token is blacklisted
        if hasattr(refresh, 'blacklist'):
            if refresh.blacklist().exists():
                return False, "Token is blacklisted"
        return True, "Token is valid"
    except TokenError as e:
        return False, str(e)

def should_refresh_token(access_token_exp):
    """
    Check if the access token should be refreshed based on its expiration time.
    Returns True if the token will expire within the next 5 minutes.
    """
    if not access_token_exp:
        return True
    
    try:
        exp_timestamp = access_token_exp
        current_time = timezone.now()
        time_until_expiry = exp_timestamp - current_time
        
        # Refresh if token will expire in less than 5 minutes
        return time_until_expiry <= timedelta(minutes=5)
    except Exception:
        return True

def revoke_user_tokens(user):
    """
    Revoke all refresh tokens for a user.
    """
    if api_settings.BLACKLIST_AFTER_ROTATION:
        RefreshToken.for_user(user).blacklist()
