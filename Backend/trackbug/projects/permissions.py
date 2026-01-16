from rest_framework import permissions
from .models import Project


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and getattr(user, "role", None) == "manager")


class IsProjectManager(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "POST":
            project_id = request.data.get("project")
            if not project_id:
                return False
            try:
                project = Project.objects.get(pk=project_id)
            except Project.DoesNotExist:
                return False
            user = getattr(request, "user", None)
            return bool(user and project.manager_id == getattr(user, "id", None))
        return True
