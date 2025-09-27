from pathlib import Path
import environ

# Initialize django-environ
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Take environment variables from .env file
# Ищем .env файл в родительской директории (в корне проекта)
environ.Env.read_env(BASE_DIR.parent / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])


# Application definition

INSTALLED_APPS = [
    # Django Core Apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party Apps
    "rest_framework",
    "rest_framework_api_key",
    "corsheaders",
    "drf_spectacular",
    # Your Project Apps
    "apps.users",
    "apps.advisers",
    "apps.clients",
    "apps.products",
    "apps.policies",
    "apps.deals",
    "apps.commission",
    "apps.insurances",
    "apps.mortgage",
    "apps.sales",
    "apps.reports",
    "apps.notifications",
    "apps.audit",
    "apps.tasks",
    "apps.bi_analytics",
    "apps.api_keys",
    "apps.core",  # Your core app with shared logic
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # <-- Добавлено
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --- CORS Settings ---
# In production, use CORS_ALLOWED_ORIGINS from .env for security
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[])
CORS_ALLOW_ALL_ORIGINS = False # Устанавливаем в False для безопасности

# --- Database Settings ---
DATABASES = {
    # env.db() будет искать DATABASE_URL в .env
    # и автоматически настроит подключение.
    # Для sqlite путь теперь будет относительно корня проекта.
    'default': env.db('DATABASE_URL', default=f'sqlite:///{BASE_DIR.parent / "db.sqlite3"}'),
}

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "apps.api_keys.authentication.APIKeyAuthentication",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

AUTH_USER_MODEL = "users.User"

# --- Celery Configuration Options ---
CELERY_BROKER_URL = env('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND')
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"

# Celery Beat Settings
CELERY_BEAT_SCHEDULE = {
    "check-expiring-mortgages-daily": {
        "task": "apps.notifications.tasks.check_expiring_mortgages",
        "schedule": 86400.0,  # every 24 hours
    },
}


# --- Internationalization ---
LANGUAGE_CODE = "ru" # Исправлено с "ru-ru" на "ru"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# --- Static & Media Files ---
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"


# --- Logging Configuration ---
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'debug.log',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}
