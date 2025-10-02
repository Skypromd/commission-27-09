from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Creates or resets the password for the admin superuser.'

    def handle(self, *args, **options):
        User = get_user_model()
        username = 'admin'
        password = 'admin'
        email = 'admin@example.com'

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"Superuser '{username}' already exists. Resetting password."))
            user = User.objects.get(username=username)
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Password for superuser '{username}' has been reset to '{password}'."))
        else:
            self.stdout.write(f"Creating a new superuser: {username}")
            User.objects.create_superuser(username, email, password)
            self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' created successfully with password '{password}'."))

