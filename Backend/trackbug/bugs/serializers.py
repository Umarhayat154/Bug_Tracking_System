from rest_framework import serializers
from .models import Bugs
from accounts.serializers import UserSerializer
from django.contrib.auth import get_user_model


User = get_user_model()


class BugSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    creator = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='assignee',
        write_only=True,    
        required=False,
        allow_null=True
    )
    bug_attachment_url=serializers.SerializerMethodField()
    class Meta:
        model = Bugs
        fields = [
            'id', 'project', 'title', 'detail', 'deadline', 'status',
            'type', 'bug_attachment','bug_attachment_url', 'assignee', 'creator', 'assignee_id', 'created_at', 'updated_at'
        ]
    
    def get_bug_attachment_url(self, obj):
      request = self.context.get('request')
      if obj.bug_attachment:
        return request.build_absolute_uri(obj.bug_attachment.url)
      return None
    
    def validate(self, data):
        instance = self.instance
        bug_type = data.get('type', instance.type if instance else None)
        status = data.get('status', instance.status if instance else None)

        valid_status = {
            "bug": ['new', 'started', 'resolved'],
            "feature": ['new', 'started', 'completed']
        }

        if bug_type and status and status not in valid_status.get(bug_type, []):
            raise serializers.ValidationError(
                {"status": f"Invalid status '{status}' for type '{bug_type}'"}
            )
        return data

    def validate_bug_attachment(self, value):
        if value and not value.name.lower().endswith(('.png', '.gif')):
            raise serializers.ValidationError(
                "Only PNG or GIF files are allowed.")
        return value

