from django.db import models
from django.conf import settings
from projects.models import Project, ProjectMembers


class Bugs(models.Model):

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="bugs")
    title = models.CharField(max_length=255)
    detail = models.TextField(blank=True, null=True)
    deadline = models.DateField(null=True, blank=True)

    TYPE_CHOICES = [
        ('bug', 'Bug'),
        ('feature', 'Feature')
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('started', 'Started'),
        ('resolved', 'Resolved'),
        ('completed', 'Completed')
    ]
    status = models.CharField(
        max_length=30, choices=STATUS_CHOICES)
    type = models.CharField(
        max_length=30, choices=TYPE_CHOICES)
    bug_attachment = models.ImageField(upload_to="bug_attachments/", blank=True, null=True)

    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assignee_bug'
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='creator_bug', null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [models.UniqueConstraint(
            fields=['project', 'title'], name='unique_bug_title_per_project')]

    def __str__(self):
        return self.title
