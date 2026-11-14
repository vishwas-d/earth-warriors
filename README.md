# Earth Warriors demo application

Responsive React + Django REST Framework application for Yamuna research, fieldwork, public submissions and community updates. Demo records and illustrative impact figures are visibly marked; confirm facts, contact details, schedules and records with the organization before public launch.

## Local development

Requirements: Docker Desktop with Docker Compose.

```sh
docker compose up --build
```

- Frontend with Vite hot reload: http://localhost:5173
- Django API: http://localhost:8000/api/
- Django admin: http://localhost:8000/admin/
- PostgreSQL: localhost:5432

The compose startup migrates the database, seeds clearly marked demo records and collects static files. Source code and local media are mounted into containers for development; database uploads persist in named volumes.
If ports 8000 or 5173 are already in use, set `BACKEND_PORT` or `VITE_PORT` to choose alternate host ports.

Run backend tests:

```sh
docker compose exec backend python manage.py test
```

Create an admin account:

```sh
docker compose exec backend python manage.py createsuperuser
```

Admin users can assign researcher and volunteer-manager roles in Django admin. The API also provides JWT endpoints at `/api/token/` and `/api/token/refresh/`.

## Production containers

Set strong `POSTGRES_PASSWORD` and `DJANGO_SECRET_KEY` values and configure `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS`, then start the Nginx-served production frontend:

```sh
docker compose --env-file .env -f docker-compose.prod.yml up --build -d
```

The frontend is served on the configured `FRONTEND_PORT` (default 8080). Production startup applies database migrations but does not insert demo records. Add verified organization content through the admin/API before launch.

## Local media

The local `earth-warriors-assets/` directory is mounted at `/assets/` by Vite and Nginx. The media folder is excluded from Docker build contexts (it is approximately 1.9 GB) and is served from a read-only host mount in production. Uploaded effluent-report evidence is stored in the persistent `backend_media` volume and is only served through a staff-authenticated endpoint.

## API overview

- `GET /api/blogs/` — published posts, newest first
- `GET /api/media-coverage/`, `/api/government-letters/`, `/api/groundwork-drives/`, `/api/expose-videos/`, `/api/campaigns/`, `/api/water-test-results/`
- `GET /api/impact/`
- `GET /api/impact-metrics/` — public metrics, editable by administrators and volunteer managers
- `POST /api/water-test-requests/` — returns a tracking ticket
- `POST /api/effluent-reports/` — accepts multipart form data and optional evidence (up to 25 MB)
- `POST /api/drive-rsvps/`

Public users can read catalog data and submit requests/reports. Catalog writes and access to private submissions and uploaded evidence require an authenticated staff user with an appropriate role.
