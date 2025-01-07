from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: self._get_user(request))
        return self.get_response(request)

    def _get_user(self, request):
        auth = JWTAuthentication()
        try:
            user, _ = auth.authenticate(request)
            return user
        except (InvalidToken, TokenError):
            return None