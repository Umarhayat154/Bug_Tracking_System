from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator


class MainUserManager(BaseUserManager):
    def create_user(self, email, password=None, name=None, role=None):
        if not email:
            raise ValueError("User must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email=email, password=password, role="manager")
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    Roles = [
        ("manager", "Manager"),
        ("qa", "QA"),
        ("developer", "Developer")
    ]

    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=15, choices=Roles, null=True, blank=True)
    mobile_number = models.CharField(
        validators=[phone_regex], max_length=17, blank=True, null=True)
    profile_images = models.ImageField(
        upload_to='profile_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = MainUserManager()

    def __str__(self):
        return self.email

