from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
from .models import User, VerificationToken, PasswordResetToken

def generate_token():
    return get_random_string(64)

def send_verification_email(user):
    token = VerificationToken.objects.create(
        user=user,
        token=generate_token(),
        expires_at=timezone.now() + timedelta(hours=24)
    )
    
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token.token}"
    
    context = {
        'user': user,
        'verification_url': verification_url
    }
    
    html_message = render_to_string('emails/verify_email.html', context)
    plain_message = render_to_string('emails/verify_email.txt', context)
    
    send_mail(
        'Verify your email address',
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message
    )
    
    return token

def verify_email(token_string):
    try:
        token = VerificationToken.objects.get(
            token=token_string,
            is_used=False,
            expires_at__gt=timezone.now()
        )
        user = token.user
        user.is_verified = True
        user.save()
        
        token.is_used = True
        token.save()
        
        return True, "Email verified successfully"
    except VerificationToken.DoesNotExist:
        return False, "Invalid or expired verification token"

def send_password_reset_email(user):
    token = PasswordResetToken.objects.create(
        user=user,
        token=generate_token(),
        expires_at=timezone.now() + timedelta(hours=1)
    )
    
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token.token}"
    
    context = {
        'user': user,
        'reset_url': reset_url
    }
    
    html_message = render_to_string('emails/reset_password.html', context)
    plain_message = render_to_string('emails/reset_password.txt', context)
    
    send_mail(
        'Reset your password',
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message
    )
    
    return token

def verify_reset_token(token_string):
    try:
        token = PasswordResetToken.objects.get(
            token=token_string,
            is_used=False,
            expires_at__gt=timezone.now()
        )
        return True, token
    except PasswordResetToken.DoesNotExist:
        return False, None

def reset_password(token_string, new_password):
    is_valid, token = verify_reset_token(token_string)
    if not is_valid:
        return False, "Invalid or expired reset token"
    
    user = token.user
    user.set_password(new_password)
    user.save()
    
    token.is_used = True
    token.save()
    
    return True, "Password reset successfully"
