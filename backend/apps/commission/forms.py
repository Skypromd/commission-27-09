from django import forms
from .models import Client, Deal
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email']

class DealForm(forms.ModelForm):
    class Meta:
        model = Deal
        fields = [
            "client", "product", "title", "base_amount", "commission_rate", 
            "status"
        ]

    def __init__(self, *args, **kwargs):
        user = kwargs.pop("user", None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields["client"].queryset = Client.objects.filter(user=user)
