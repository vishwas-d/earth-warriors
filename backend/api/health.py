from pathlib import Path

from django.conf import settings
from django.db import connection
from django.db.utils import DatabaseError
from django.http import FileResponse, Http404, JsonResponse
from django.views.decorators.http import require_GET


def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except DatabaseError:
        return JsonResponse({"status": "unavailable"}, status=503)
    return JsonResponse({"status": "ok"})


@require_GET
def protected_media(request, file_path):
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"detail": "Staff authentication is required."}, status=403)

    media_root = Path(settings.MEDIA_ROOT).resolve()
    try:
        resolved_path = (media_root / file_path).resolve(strict=True)
    except (OSError, RuntimeError):
        raise Http404 from None

    if media_root not in resolved_path.parents or not resolved_path.is_file():
        raise Http404

    response = FileResponse(resolved_path.open("rb"), as_attachment=True, filename=resolved_path.name, content_type="application/octet-stream")
    response["X-Content-Type-Options"] = "nosniff"
    return response
