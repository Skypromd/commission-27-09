from django.apps import AppConfig


class InsurancesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.insurances'

    def ready(self):
        # Import signals to connect them when the app is ready.
        import backend.apps.insurances.signals
