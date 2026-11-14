from datetime import date, datetime, timezone

from django.core.management.base import BaseCommand

from api.models import BlogPost, GovernmentLetter, GroundworkDrive, ImpactMetric, MediaCoverage


class Command(BaseCommand):
    help = "Create clearly marked demonstration records for local preview."

    def handle(self, *args, **options):
        metrics = [
            ("total-waste", "Total waste collected", 14000, "kg"),
            ("drives", "Sunday drives & Samvaads", 300, ""),
            ("samples-tested", "Water samples tested", 500, ""),
            ("letters-filed", "Letters & petitions filed", 50, ""),
        ]
        for key, label, value, unit in metrics:
            ImpactMetric.objects.update_or_create(
                key=key,
                defaults={"label": label, "value": value, "unit": unit, "is_demo": True},
            )

        entries = [
            ("reading-water-quality", "A field guide to reading water-quality results", "Scientific Analysis", "What common water-quality parameters can and cannot tell us about a sample."),
            ("public-records-and-river-health", "Why public records matter for river health", "Legal & Government Updates", "How clear, timely disclosure supports stronger public oversight."),
            ("yamuna-samvaad", "Yamuna Samvaad: connecting care with action", "Yamuna Samvaad Insights", "A community conversation about stewardship, public welfare and the river."),
        ]
        for index, (slug, title, category, summary) in enumerate(entries):
            BlogPost.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "summary": summary,
                    "content_markdown": f"Demonstration article. Verify facts and attach primary sources before publishing.\\n\\n{summary}",
                    "category": category,
                    "parameters_covered": [],
                    "published_at": datetime(2025, 3 - index, max(1, 12 - index * 3), tzinfo=timezone.utc),
                    "is_demo": True,
                },
            )

        letter_entries = [
            ("Sample correspondence on drain monitoring", "DJB", date(2025, 1, 15), "Awaiting Reply", "DEMO-001"),
            ("Sample request for treatment-plant disclosure", "DPCC", date(2025, 2, 2), "Sent", "DEMO-002"),
            ("Sample public-interest representation", "I&FD", date(2025, 3, 10), "Escalated to NGT", "DEMO-003"),
        ]
        for title, body, letter_date, status, reference in letter_entries:
            GovernmentLetter.objects.update_or_create(
                reference=reference,
                defaults={
                    "title": title, "issuing_body": body, "letter_date": letter_date, "status": status,
                    "summary": "Illustrative record only. Not an official letter; no source document is attached.",
                    "is_demo": True,
                },
            )

        GroundworkDrive.objects.update_or_create(
            location_ghat="Yamuna riverbank",
            drive_date=date(2025, 1, 12),
            defaults={
                "status": GroundworkDrive.Status.COMPLETED, "volunteers_attended": 0, "waste_collected_kg": 0,
                "samvaad_topic": "Public welfare and stewardship", "gallery_images": [], "is_demo": True,
            },
        )
        GroundworkDrive.objects.update_or_create(
            location_ghat="Kalindi Kunj Ghat, Delhi",
            drive_date=None,
            defaults={
                "status": GroundworkDrive.Status.UPCOMING, "volunteers_attended": 0, "waste_collected_kg": 0,
                "samvaad_topic": "Yamuna Samvaad: water, public welfare & stewardship", "gallery_images": [], "is_demo": True,
            },
        )
        MediaCoverage.objects.update_or_create(
            outlet_name="NewsX",
            headline="Yamuna field operations — sample media entry",
            defaults={
                "media_type": MediaCoverage.MediaType.TV_VIDEO, "published_date": None, "article_url": "",
                "summary": "Illustrative coverage listing; confirm publication and source URL before use.",
                "is_featured": False, "is_demo": True,
            },
        )
        self.stdout.write(self.style.SUCCESS("Demo records are ready. All seeded records are marked is_demo=True."))
