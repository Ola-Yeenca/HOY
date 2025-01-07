from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.http import JsonResponse
from .token_service import should_refresh_token, refresh_tokens
import jwt
from django.conf import settings

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip token refresh for certain paths
        skip_paths = [
            '/api/auth/token/',
            '/api/auth/token/refresh/',
            '/api/auth/token/verify/',
        ]
        if request.path in skip_paths:
            return self.get_response(request)

        # Try to get the access token from the Authorization header
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                # Decode token without verification to get expiration time
                decoded_token = jwt.decode(
                    token,
                    settings.SECRET_KEY,
                    algorithms=['HS256'],
                    options={'verify_signature': False}
                )
                
                # Check if token needs refresh
                if should_refresh_token(decoded_token.get('exp')):
                    # Get refresh token from request
                    refresh_token = request.COOKIES.get('refresh_token')
                    if refresh_token:
                        try:
                            # Generate new tokens
                            new_tokens = refresh_tokens(refresh_token)
                            
                            # Create response
                            response = self.get_response(request)
                            
                            # Add new access token to response headers
                            response['New-Access-Token'] = new_tokens['access']
                            
                            # Set new refresh token in cookie
                            response.set_cookie(
                                'refresh_token',
                                new_tokens['refresh'],
                                httponly=True,
                                secure=True,
                                samesite='Strict',
                                max_age=7 * 24 * 60 * 60  # 7 days
                            )
                            
                            return response
                        except (InvalidToken, TokenError):
                            # If refresh fails, continue with the current token
                            pass
            except jwt.DecodeError:
                pass

        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Add user to request if authenticated
        if hasattr(request, 'user'):
            return None

        try:
            jwt_auth = JWTAuthentication()
            auth_tuple = jwt_auth.authenticate(request)
            if auth_tuple is not None:
                user, _ = auth_tuple
                request.user = SimpleLazyObject(lambda: user)
        except (InvalidToken, TokenError):
            pass

        return None
