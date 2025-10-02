from django.apps import AppConfig

class AdvisersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.apps.advisers'

    def ready(self):
        # Import signals to connect them when the app is ready.
        import backend.apps.advisers.signals

