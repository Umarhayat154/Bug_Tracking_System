from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from .models import Project, ProjectMembers
from .serializers import ProjectSerializer, ProjectMemberSerializer
from .permissions import IsManager, IsProjectManager


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'manager':
            return Project.objects.filter(manager=user)
        if not user.is_authenticated:
            return Project.objects.none()
        if user.role in ['qa', 'developer']:
            return Project.objects.filter(projects_user__user=user)
        return Project.objects.none()

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsManager()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        project = serializer.save(manager=user)
        ProjectMembers.objects.get_or_create(project=project, user=user)


class ProjectMembersViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectMemberSerializer
    def get_queryset(self):
        queryset = ProjectMembers.objects.all()

        project_id = self.request.query_params.get("project")
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    def get_permissions(self):
        if self.action == "create":
            return [IsProjectManager()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        project_id = request.data.get("project")
        user_id = request.data.get("user")
        if not project_id or not user_id:
            return Response({'Error': 'project and user are required'}, status=status.HTTP_400_BAD_REQUEST)
        if ProjectMembers.objects.filter(project_id=project_id, user_id=user_id).exists():
            return Response({'Error': 'User already Membered'}, status=status.HTTP_400_BAD_REQUEST)

        response = super().create(request, *args, **kwargs)
        return response
