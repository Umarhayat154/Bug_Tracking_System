from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Project, ProjectMembers
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    manager = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Project
        fields = ('id', 'name', 'manager', 'description', 'logo',
                  'logo_url', 'created_at', 'updated_at')

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo:
            return request.build_absolute_uri(obj.logo.url)
        return None


class ProjectMemberSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = ProjectMembers
        fields = ('id', 'project', 'user')
