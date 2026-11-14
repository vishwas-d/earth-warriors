from rest_framework import serializers

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


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = BlogPost
        fields = ["id", "title", "slug", "summary", "content_markdown", "author_name", "cover_image", "category", "parameters_covered", "published_at", "is_demo"]


class MediaCoverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaCoverage
        fields = ["id", "outlet_name", "outlet_logo_url", "headline", "article_url", "media_type", "published_date", "summary", "is_featured", "is_demo"]


class GovernmentLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentLetter
        fields = ["id", "title", "issuing_body", "document_pdf_url", "letter_date", "status", "summary", "reference", "is_demo"]


class GroundworkDriveSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroundworkDrive
        fields = ["id", "location_ghat", "drive_date", "volunteers_attended", "waste_collected_kg", "samvaad_topic", "gallery_images", "status", "is_demo"]


class ExposeVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExposeVideo
        fields = ["id", "title", "facility_name", "video_url", "thumbnail_url", "authority_action_taken", "published_date", "is_demo"]


class ActiveCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveCampaign
        fields = ["id", "campaign_title", "hotspot_location", "placard_slogan", "photos", "impact_summary", "date", "is_demo"]


class WaterTestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterTestResult
        fields = ["id", "sample_location", "source_type", "bod", "cod", "tss", "tds", "fecal_coliform", "bis_compliance_status", "tested_at", "is_demo"]


class ImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = ["id", "key", "label", "value", "unit", "updated_at", "is_demo"]


class WaterTestRequestSerializer(serializers.ModelSerializer):
    ticket_id = serializers.UUIDField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = WaterTestRequest
        fields = ["id", "applicant_name", "email", "phone", "address_noida", "water_source_type", "ticket_id", "status", "created_at"]
        read_only_fields = ["id", "ticket_id", "status", "created_at"]


class EffluentReportSerializer(serializers.ModelSerializer):
    evidence = serializers.FileField(required=False, allow_empty_file=False)

    class Meta:
        model = EffluentReport
        fields = ["id", "reporter_name", "location_drain", "description", "evidence", "submitted_at", "status"]
        read_only_fields = ["id", "submitted_at", "status"]

    def validate_evidence(self, file):
        if file and file.size > 25 * 1024 * 1024:
            raise serializers.ValidationError("Evidence files must be 25 MB or smaller.")
        return file


class DriveRsvpSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveRsvp
        fields = ["id", "name", "email", "drive_date", "created_at"]
        read_only_fields = ["id", "created_at"]
