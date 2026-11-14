from django.db.models import Sum
from rest_framework import mixins, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ActiveCampaign,
    BlogPost,
    DriveRsvp,
    EffluentReport,
    ExposeVideo,
    GovernmentLetter,
    GroundworkDrive,
    ImpactMetric,
    MediaCoverage,
    WaterTestRequest,
    WaterTestResult,
)
from .permissions import RoleWritePermission, SubmissionOrStaffPermission
from .serializers import (
    ActiveCampaignSerializer,
    BlogPostSerializer,
    DriveRsvpSerializer,
    EffluentReportSerializer,
    ExposeVideoSerializer,
    GovernmentLetterSerializer,
    GroundworkDriveSerializer,
    ImpactMetricSerializer,
    MediaCoverageSerializer,
    WaterTestRequestSerializer,
    WaterTestResultSerializer,
)


class PublicCatalogViewSet(viewsets.ModelViewSet):
    permission_classes = [RoleWritePermission]


class BlogPostViewSet(PublicCatalogViewSet):
    queryset = BlogPost.objects.select_related("author").filter(published_at__isnull=False).order_by("-published_at", "-id")
    serializer_class = BlogPostSerializer
    lookup_field = "slug"
    write_roles = {"ADMIN", "RESEARCHER"}


class MediaCoverageViewSet(PublicCatalogViewSet):
    queryset = MediaCoverage.objects.all().order_by("-published_date", "-id")
    serializer_class = MediaCoverageSerializer
    write_roles = {"ADMIN", "VOLUNTEER_MGR"}


class GovernmentLetterViewSet(PublicCatalogViewSet):
    queryset = GovernmentLetter.objects.all().order_by("-letter_date", "-id")
    serializer_class = GovernmentLetterSerializer
    write_roles = {"ADMIN", "RESEARCHER"}


class GroundworkDriveViewSet(PublicCatalogViewSet):
    queryset = GroundworkDrive.objects.all().order_by("-drive_date", "-id")
    serializer_class = GroundworkDriveSerializer
    write_roles = {"ADMIN", "VOLUNTEER_MGR"}


class ExposeVideoViewSet(PublicCatalogViewSet):
    queryset = ExposeVideo.objects.all().order_by("-published_date", "-id")
    serializer_class = ExposeVideoSerializer
    write_roles = {"ADMIN", "RESEARCHER"}


class ActiveCampaignViewSet(PublicCatalogViewSet):
    queryset = ActiveCampaign.objects.all().order_by("-date", "-id")
    serializer_class = ActiveCampaignSerializer
    write_roles = {"ADMIN", "VOLUNTEER_MGR"}


class WaterTestResultViewSet(PublicCatalogViewSet):
    queryset = WaterTestResult.objects.all().order_by("-tested_at", "-id")
    serializer_class = WaterTestResultSerializer
    write_roles = {"ADMIN", "RESEARCHER"}


class ImpactMetricViewSet(PublicCatalogViewSet):
    queryset = ImpactMetric.objects.all()
    serializer_class = ImpactMetricSerializer
    write_roles = {"ADMIN", "VOLUNTEER_MGR"}


class WaterTestRequestViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = WaterTestRequestSerializer
    permission_classes = [SubmissionOrStaffPermission]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return WaterTestRequest.objects.all()
        return WaterTestRequest.objects.none()


class EffluentReportViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = EffluentReportSerializer
    permission_classes = [SubmissionOrStaffPermission]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return EffluentReport.objects.all()
        return EffluentReport.objects.none()


class DriveRsvpCreateView(CreateAPIView):
    serializer_class = DriveRsvpSerializer
    permission_classes = [AllowAny]
    queryset = DriveRsvp.objects.all()


class ImpactView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        metrics = {metric.key: metric for metric in ImpactMetric.objects.all()}
        if metrics:
            return Response(
                {
                    "total_waste_kg": float(metrics["total-waste"].value) if "total-waste" in metrics else 0,
                    "drives_conducted": int(metrics["drives"].value) if "drives" in metrics else 0,
                    "samples_tested": int(metrics["samples-tested"].value) if "samples-tested" in metrics else 0,
                    "letters_filed": int(metrics["letters-filed"].value) if "letters-filed" in metrics else 0,
                    "is_demo": any(metric.is_demo for metric in metrics.values()),
                }
            )
        drives = GroundworkDrive.objects.filter(status="Completed")
        completed_count = drives.count()
        waste = drives.aggregate(total=Sum("waste_collected_kg"))["total"] or 0
        return Response(
            {
                "total_waste_kg": float(waste),
                "drives_conducted": completed_count,
                "samples_tested": WaterTestResult.objects.count(),
                "letters_filed": GovernmentLetter.objects.count(),
                "is_demo": (
                    drives.filter(is_demo=True).exists()
                    or GovernmentLetter.objects.filter(is_demo=True).exists()
                    or WaterTestResult.objects.filter(is_demo=True).exists()
                ),
            }
        )
