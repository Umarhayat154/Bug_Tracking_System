from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Bugs
from .serializers import BugSerializer
from projects.models import ProjectMembers
from rest_framework.parsers import MultiPartParser, FormParser


class BugsViewSet(viewsets.ModelViewSet):
    serializer_class = BugSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        from accounts.models import User
        user = request.user
        project_id = request.data.get("project")
        assignee_id = request.data.get("assignee")

        if not ProjectMembers.objects.filter(project=project_id, user=user).exists():
            return Response({"error": 'you are not assign to this project'}, status=status.HTTP_403_FORBIDDEN)
        if user.role != "qa":
            return Response({"error": "Only QA can create the Bugs"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        bug = serializer.save(creator=user)

        if assignee_id:
            try:
                assignee = User.objects.get(id=assignee_id)
                bug.assignee = assignee
                bug.save()
            except User.DoesNotExist:
                pass

        serializer = self.get_serializer(bug)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        if user.role == 'developer' and instance.assignee != user:
            return Response({"error": "you can only update bugs"}, status=status.HTTP_403_FORBIDDEN)
        if user.role == 'manager' and instance.project.manager != user:
            return Response({"error": "you are not the manager for this project"}, status=status.HTTP_403_FORBIDDEN)
        if 'bug_attachment' in request.FILES and user.role != 'developer':
            return Response({"error": "Only developer can added the screenshot"}, status=status.HTTP_403_FORBIDDEN)

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Bugs.objects.none()
        if user.role == 'manager':
            return Bugs.objects.filter(project__manager=user)
        elif user.role == 'qa':
            return Bugs.objects.filter(creator=user.id)
        elif user.role == 'developer':
            return Bugs.objects.filter(assignee=user.id)
        return Bugs.objects.none()
