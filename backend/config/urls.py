from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    ActiveCampaignViewSet,
    BlogPostViewSet,
    DriveRsvpCreateView,
    EffluentReportViewSet,
    ExposeVideoViewSet,
    GovernmentLetterViewSet,
    GroundworkDriveViewSet,
    ImpactView,
    ImpactMetricViewSet,
    MediaCoverageViewSet,
    WaterTestRequestViewSet,
    WaterTestResultViewSet,
)
from api.health import health_check, protected_media

router = DefaultRouter()
router.register("blogs", BlogPostViewSet, basename="blog")
router.register("media-coverage", MediaCoverageViewSet, basename="media-coverage")
router.register("government-letters", GovernmentLetterViewSet, basename="government-letter")
router.register("groundwork-drives", GroundworkDriveViewSet, basename="groundwork-drive")
router.register("expose-videos", ExposeVideoViewSet, basename="expose-video")
router.register("campaigns", ActiveCampaignViewSet, basename="campaign")
router.register("water-test-results", WaterTestResultViewSet, basename="water-test-result")
router.register("impact-metrics", ImpactMetricViewSet, basename="impact-metric")
router.register("water-test-requests", WaterTestRequestViewSet, basename="water-test-request")
router.register("effluent-reports", EffluentReportViewSet, basename="effluent-report")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("private-media/<path:file_path>", protected_media, name="protected-media"),
    path("api/", include(router.urls)),
    path("api/impact/", ImpactView.as_view(), name="impact"),
    path("api/drive-rsvps/", DriveRsvpCreateView.as_view(), name="drive-rsvp"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
