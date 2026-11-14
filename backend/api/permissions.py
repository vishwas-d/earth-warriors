from rest_framework.permissions import BasePermission, SAFE_METHODS


class RoleWritePermission(BasePermission):
    allowed_roles = {
        "ADMIN": {"ADMIN", "RESEARCHER", "VOLUNTEER_MGR"},
        "RESEARCHER": {"ADMIN", "RESEARCHER"},
        "VOLUNTEER_MGR": {"ADMIN", "VOLUNTEER_MGR"},
    }

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        required = getattr(view, "write_roles", self.allowed_roles["ADMIN"])
        return request.user.is_superuser or request.user.role in required


class SubmissionOrStaffPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))
