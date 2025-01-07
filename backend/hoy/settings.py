"""
Django settings for HOY project.
"""

from pathlib import Path
from datetime import timedelta
import os
import sys
from decouple import config
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('DJANGO_SECRET_KEY', default='your-secret-key-here')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

# Application definition
INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'channels',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_extensions',
    'drf_yasg',  # for API documentation
    'social_django',
    
    # Local apps
    'users',
    'authentication',
    'feedback',
    'events',
    'gallery',
    'recommendations',  
    'dj_schedules',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'authentication.middleware.JWTAuthenticationMiddleware',  
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hoy.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hoy.wsgi.application'

# Channels configuration
ASGI_APPLICATION = 'hoy.asgi.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(os.getenv('REDIS_HOST', 'redis'), 6379)],
        },
    },
}

# Database
DATABASES = {
    'default': dj_database_url.config(default=config('DATABASE_URL', default='postgres://postgres:postgres@db:5432/hoy_db')),
    'test': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test_hoy_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'db',
        'PORT': '5432',
    }
}

# Use the test database for testing
if 'test' in sys.argv:
    DATABASES['default'] = DATABASES['test']

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# Swagger settings
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    'USE_SESSION_AUTH': False,
    'JSON_EDITOR': True,
    'SUPPORTED_SUBMIT_METHODS': ['get', 'post', 'put', 'delete', 'patch'],
    'DEFAULT_AUTO_SCHEMA_CLASS': 'drf_yasg.inspectors.SwaggerAutoSchema',
}

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),  
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'TOKEN_USER_CLASS': 'users.User',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=15),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=7),
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default=[
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://frontend:3000',
    ],
    cast=lambda v: [s.strip() for s in v.split(',')]
)
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = False
CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    default=[
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://frontend:3000',
    ],
    cast=lambda v: [s.strip() for s in v.split(',')]
)

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = ['content-type', 'x-csrftoken']

# Security settings for development
SECURE_CROSS_ORIGIN_OPENER_POLICY = None
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_USE_SESSIONS = False
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'

# Session settings
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 1209600  # 2 weeks in seconds

# Email settings
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='HOY <noreply@houseofyoung.com>')

# Frontend URL for password reset links
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:3000')

# Password Reset settings
PASSWORD_RESET_TIMEOUT = 86400  # 24 hours in seconds
PASSWORD_RESET_THROTTLE_RATE = '5/h'  # Limit password reset attempts

# Security Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', default=not DEBUG, cast=bool)
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=not DEBUG, cast=bool)
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=not DEBUG, cast=bool)
SECURE_HSTS_SECONDS = config('SECURE_HSTS_SECONDS', default=31536000 if not DEBUG else 0, cast=int)  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = config('SECURE_HSTS_SUBDOMAINS', default=not DEBUG, cast=bool)
SECURE_HSTS_PRELOAD = config('SECURE_HSTS_PRELOAD', default=not DEBUG, cast=bool)

# Google OAuth2 settings
GOOGLE_OAUTH2_CLIENT_ID = config('GOOGLE_OAUTH2_CLIENT_ID', default='')
GOOGLE_OAUTH2_CLIENT_SECRET = config('GOOGLE_OAUTH2_CLIENT_SECRET', default='')
GOOGLE_OAUTH2_SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

# Apple Sign In settings
APPLE_TEAM_ID = config('APPLE_TEAM_ID', default='')
APPLE_KEY_ID = config('APPLE_KEY_ID', default='')
APPLE_PRIVATE_KEY = config('APPLE_PRIVATE_KEY', default='')
APPLE_BUNDLE_ID = config('APPLE_BUNDLE_ID', default='com.hoy.app')

# Phone verification settings (Twilio)
TWILIO_ACCOUNT_SID = config('TWILIO_ACCOUNT_SID', default='')
TWILIO_AUTH_TOKEN = config('TWILIO_AUTH_TOKEN', default='')
TWILIO_VERIFY_SERVICE_SID = config('TWILIO_VERIFY_SERVICE_SID', default='')

# Social Authentication
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get('GOOGLE_OAUTH2_KEY', '')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get('GOOGLE_OAUTH2_SECRET', '')

SOCIAL_AUTH_APPLE_ID_CLIENT = os.environ.get('APPLE_ID_CLIENT', '')
SOCIAL_AUTH_APPLE_ID_TEAM = os.environ.get('APPLE_ID_TEAM', '')
SOCIAL_AUTH_APPLE_ID_KEY = os.environ.get('APPLE_ID_KEY', '')
SOCIAL_AUTH_APPLE_ID_SECRET = os.environ.get('APPLE_ID_SECRET', '')

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.apple.AppleIdAuth',
)

# AI Settings
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
TENSORFLOW_MODEL_PATH = os.path.join(BASE_DIR, 'recommendations/models')

# Ensure model directory exists
os.makedirs(TENSORFLOW_MODEL_PATH, exist_ok=True)
