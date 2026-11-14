import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator, MinValueValidator
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        RESEARCHER = "RESEARCHER", "Researcher"
        VOLUNTEER_MGR = "VOLUNTEER_MGR", "Volunteer Manager"
        PUBLIC = "PUBLIC", "Public"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PUBLIC)


class DemoRecord(models.Model):
    is_demo = models.BooleanField(default=False, db_index=True)

    class Meta:
        abstract = True


class ImpactMetric(DemoRecord):
    key = models.SlugField(max_length=60, unique=True)
    label = models.CharField(max_length=120)
    value = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    unit = models.CharField(max_length=24, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["key"]

    def __str__(self):
        return f"{self.label}: {self.value} {self.unit}".strip()


class BlogPost(DemoRecord):
    title = models.CharField(max_length=240)
    slug = models.SlugField(max_length=255, unique=True)
    content_markdown = models.TextField()
    summary = models.CharField(max_length=500, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="blog_posts")
    cover_image = models.CharField(max_length=500, blank=True)
    category = models.CharField(max_length=80)
    parameters_covered = models.JSONField(default=list, blank=True)
    published_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at", "-id"]

    def __str__(self):
        return self.title


class MediaCoverage(DemoRecord):
    class MediaType(models.TextChoices):
        PRINT = "Print", "Print"
        DIGITAL = "Digital", "Digital"
        TV_VIDEO = "TV/Video", "TV/Video"

    outlet_name = models.CharField(max_length=120)
    outlet_logo_url = models.CharField(max_length=500, blank=True)
    headline = models.CharField(max_length=240)
    article_url = models.URLField(blank=True)
    media_type = models.CharField(max_length=20, choices=MediaType.choices)
    published_date = models.DateField(null=True, blank=True)
    summary = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.outlet_name}: {self.headline}"


class GovernmentLetter(DemoRecord):
    class Status(models.TextChoices):
        SENT = "Sent", "Sent"
        AWAITING_REPLY = "Awaiting Reply", "Awaiting Reply"
        ESCALATED = "Escalated to NGT", "Escalated to NGT"
        RESPONDED = "Responded", "Responded"

    title = models.CharField(max_length=240)
    issuing_body = models.CharField(max_length=80)
    document_pdf_url = models.CharField(max_length=500, blank=True)
    letter_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.SENT)
    summary = models.TextField(blank=True)
    reference = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ["-letter_date", "-id"]

    def __str__(self):
        return self.title


class GroundworkDrive(DemoRecord):
    class Status(models.TextChoices):
        UPCOMING = "Upcoming", "Upcoming"
        COMPLETED = "Completed", "Completed"

    location_ghat = models.CharField(max_length=200)
    drive_date = models.DateField(null=True, blank=True)
    volunteers_attended = models.PositiveIntegerField(default=0)
    waste_collected_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    samvaad_topic = models.CharField(max_length=240, blank=True)
    gallery_images = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=12, choices=Status.choices)

    class Meta:
        ordering = ["-drive_date", "-id"]

    def __str__(self):
        return f"{self.location_ghat} ({self.status})"


class ExposeVideo(DemoRecord):
    title = models.CharField(max_length=240)
    facility_name = models.CharField(max_length=160)
    video_url = models.CharField(max_length=500)
    thumbnail_url = models.CharField(max_length=500, blank=True)
    authority_action_taken = models.CharField(max_length=300, blank=True)
    published_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


class ActiveCampaign(DemoRecord):
    campaign_title = models.CharField(max_length=240)
    hotspot_location = models.CharField(max_length=200)
    placard_slogan = models.CharField(max_length=240)
    photos = models.JSONField(default=list, blank=True)
    impact_summary = models.TextField(blank=True)
    date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.campaign_title


class WaterTestResult(DemoRecord):
    class SourceType(models.TextChoices):
        GROUNDWATER = "Groundwater", "Groundwater"
        DRAIN = "Drain", "Drain"
        OUTLET = "STP/CETP Outlet", "STP/CETP Outlet"
        GHAT = "River Ghat", "River Ghat"

    sample_location = models.CharField(max_length=200)
    source_type = models.CharField(max_length=24, choices=SourceType.choices)
    bod = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cod = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tss = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tds = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fecal_coliform = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    bis_compliance_status = models.CharField(max_length=20, blank=True)
    tested_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.sample_location} ({self.source_type})"


class WaterTestRequest(models.Model):
    class Status(models.TextChoices):
        RECEIVED = "Received", "Received"
        COLLECTED = "Sample Collected", "Sample Collected"
        TESTING = "Testing in Progress", "Testing in Progress"
        READY = "Report Ready", "Report Ready"

    class SourceType(models.TextChoices):
        GROUNDWATER = "Groundwater", "Groundwater"
        TAP_WATER = "Tap Water", "Tap water"
        OTHER = "Other", "Other"

    applicant_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=24)
    address_noida = models.CharField(max_length=500)
    water_source_type = models.CharField(max_length=40, choices=SourceType.choices)
    ticket_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.RECEIVED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.ticket_id} ({self.status})"


class EffluentReport(models.Model):
    class Status(models.TextChoices):
        PENDING = "Pending Verification", "Pending Verification"
        VERIFIED = "Verified", "Verified"
        ESCALATED = "Escalated", "Escalated"

    reporter_name = models.CharField(max_length=120, blank=True)
    location_drain = models.CharField(max_length=240)
    description = models.TextField()
    evidence = models.FileField(
        upload_to="effluent-reports/%Y/%m/",
        blank=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp", "mp4", "webm"])],
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.PENDING)

    def __str__(self):
        return f"{self.location_drain} ({self.status})"


class DriveRsvp(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    drive_date = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.drive_date}"
