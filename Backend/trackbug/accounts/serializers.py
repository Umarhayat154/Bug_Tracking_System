from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    profile_images_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'role',
                  'mobile_number', 'profile_images', 'profile_images_url', 'created_at', 'updated_at')

    def get_profile_images_url(self, obj):
        request = self.context.get('request')
        if obj.profile_images:
            return request.build_absolute_uri(obj.profile_images.url)
        return None


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    repeat_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password', 'repeat_password', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['repeat_password']:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match'})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('repeat_password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
