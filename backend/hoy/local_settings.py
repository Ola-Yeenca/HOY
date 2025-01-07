"""
Local development settings for HOY project.
"""

from .settings import *

# Override the database settings for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hoy_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Debug settings
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# CORS settings for local development
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
