from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from accounts.views import (
    CurrentUserView,
    RegisterView, AllUserViewList, ProfileUpdatedView, LogoutView
)
from projects.views import (
    ProjectViewSet, ProjectMembersViewSet
)
from bugs.views import BugsViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'users', AllUserViewList, basename='users')
router.register(r"project", ProjectViewSet, basename="project")
router.register(r"project-members", ProjectMembersViewSet,
                basename="project-members")
router.register(r"bugs", BugsViewSet, basename="bugs")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/token/", TokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path("api/auth/token/refresh/",
         TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/profile/",
         CurrentUserView.as_view(), name="current_user"),
    path("api/auth/profile/update/",
         ProfileUpdatedView.as_view(), name="profile_update"),
    path("api/auth/logout/",LogoutView.as_view(),name="logout")
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
