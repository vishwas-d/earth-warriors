from datetime import datetime, timezone

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import BlogPost


class PublicApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_water_request_returns_tracking_ticket(self):
        response = self.client.post(
            "/api/water-test-requests/",
            {
                "applicant_name": "Test Volunteer",
                "email": "test@example.com",
                "phone": "+91 9876543210",
                "address_noida": "Sector 1, Noida",
                "water_source_type": "Groundwater",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["ticket_id"])
        self.assertEqual(response.data["status"], "Received")

    def test_blogs_are_returned_newest_first(self):
        BlogPost.objects.create(title="Older", slug="older", category="Field Dispatches", content_markdown="Older", published_at=datetime(2024, 1, 1, tzinfo=timezone.utc))
        BlogPost.objects.create(title="Newer", slug="newer", category="Field Dispatches", content_markdown="Newer", published_at=datetime(2025, 1, 1, tzinfo=timezone.utc))
        response = self.client.get("/api/blogs/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["slug"], "newer")

    def test_public_user_cannot_list_water_requests(self):
        response = self.client.get("/api/water-test-requests/")
        self.assertEqual(response.status_code, 401)

    def test_authenticated_public_role_cannot_list_water_requests(self):
        user = get_user_model().objects.create_user(username="reader", password="test-password", role="PUBLIC")
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/water-test-requests/")
        self.assertEqual(response.status_code, 403)

    def test_catalog_write_requires_authorized_role(self):
        user = get_user_model().objects.create_user(username="public", password="pass", role="PUBLIC")
        self.client.force_authenticate(user=user)
        response = self.client.post("/api/blogs/", {"title": "No", "slug": "no", "category": "News", "content_markdown": "No"})
        self.assertEqual(response.status_code, 403)
