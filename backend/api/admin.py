from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

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
    User,
    WaterTestRequest,
    WaterTestResult,
)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (("Earth Warriors role", {"fields": ("role",)}),)
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (("Earth Warriors role", {"fields": ("role",)}),)
    list_display = ["username", "email", "role", "is_staff"]
    list_filter = ["role", "is_staff", "is_superuser"]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "published_at", "is_demo"]
    list_filter = ["category", "is_demo"]
    search_fields = ["title", "summary", "content_markdown"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(MediaCoverage)
class MediaCoverageAdmin(admin.ModelAdmin):
    list_display = ["outlet_name", "headline", "media_type", "published_date", "is_demo"]
    list_filter = ["media_type", "is_featured", "is_demo"]
    search_fields = ["outlet_name", "headline"]


@admin.register(GovernmentLetter)
class GovernmentLetterAdmin(admin.ModelAdmin):
    list_display = ["title", "issuing_body", "status", "letter_date", "is_demo"]
    list_filter = ["issuing_body", "status", "is_demo"]
    search_fields = ["title", "summary", "reference"]


@admin.register(GroundworkDrive)
class GroundworkDriveAdmin(admin.ModelAdmin):
    list_display = ["location_ghat", "drive_date", "status", "volunteers_attended", "waste_collected_kg", "is_demo"]
    list_filter = ["status", "is_demo"]


admin.site.register([ActiveCampaign, DriveRsvp, EffluentReport, ExposeVideo, ImpactMetric, WaterTestRequest, WaterTestResult])
