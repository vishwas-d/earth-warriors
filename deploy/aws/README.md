# Earth Warriors — production setup (AWS + Neon + Cloudflare)

**Stack:** Cloudflare Pages (frontend) · Neon Postgres (Singapore) · EC2 Singapore `ap-southeast-1` (`t4g.small`) + Docker (Django + Caddy).

Repo pieces: `docker-compose.aws.yml`, `deploy/aws/Caddyfile`, `deploy/aws/.env.aws.example` → copy to `.env.aws` at repo root.

---

## Phase 0 — Accounts and domains

1. **Domain** on Cloudflare (DNS managed there).
2. **AWS** account — run EC2 in [**ap-southeast-1 Singapore**](https://ap-southeast-1.console.aws.amazon.com/) (same region as Neon for low API↔DB latency).
3. **Neon** — [neon.tech](https://neon.tech), project in **AWS ap-southeast-1 (Singapore)** ([Neon regions](https://neon.com/docs/introduction/regions)).
4. **Git** remote for the repo (GitHub/GitLab) for Cloudflare Pages.

Choose hostnames, e.g.:

- `www.yourdomain.org` — frontend (Pages)
- `api.yourdomain.org` — Django API (EC2)

---

## Phase 1 — AWS billing guardrails

AWS does not hard-stop at ₹900 automatically; use budgets + a minimal footprint.

1. **Billing → Budgets → Create budget**
   - Type: **Cost budget** → Monthly
   - Amount: **$12 USD** (≈ ₹900 + buffer)
   - Alerts: **50%, 80%, 100%** actual; enable **forecasted 100%**
   - Email yourself (and a teammate).

2. **Billing preferences**
   - Turn on **Receive Billing Alerts**.
   - Add **Cost Anomaly Detection** (optional, free tier).

3. **Never create** (unless you intend to pay more): ALB, NAT Gateway, RDS, Fargate/ECS, extra EBS volumes, second regions.

4. Optional: use a **dedicated AWS account** only for this NGO project.

---

## Phase 2 — Neon (Postgres)

1. Neon console → **New project** → region **AWS Asia Pacific (Singapore)** (`aws-ap-southeast-1`).
2. Create database (default is fine). Copy:
   - Host (`ep-….ap-southeast-1.aws.neon.tech`)
   - Database name, user, password
3. Keep **Free** plan for launch; watch CU-hours if traffic grows.
4. In Neon: allow connections from anywhere (default) or restrict to your EC2 Elastic IP later.

You will put these in `.env.aws` as `POSTGRES_*` with `POSTGRES_SSLMODE=require`.

---

## Phase 3 — EC2 (API server)

### Launch instance

1. In the AWS console, set region to **Asia Pacific (Singapore) ap-southeast-1**, then **EC2 → Launch instance**
   - Name: `earth-warriors-api`
   - AMI: **Ubuntu Server 24.04 LTS**
   - Instance type: **t4g.small** (Arm)
   - Key pair: create/download `.pem`
   - Network: default VPC
   - **Storage:** **30 GiB gp3** (root volume — OS + Docker + uploads)
   - Security group (create new):
     - **SSH 22** — **your home IP only**
     - **HTTP 80** — `0.0.0.0/0`
     - **HTTPS 443** — `0.0.0.0/0`

2. **Elastic IP**
   - EC2 → Elastic IPs → Allocate → Associate with this instance.
   - Note the IP (e.g. `3.110.x.x`).

3. **DNS for API (Cloudflare)**
   - Record: `api` → **A** → Elastic IP
   - For easiest TLS with Caddy: set **`api` to DNS only (grey cloud)** so Let’s Encrypt HTTP challenge works.
   - Frontend `www` can stay **proxied (orange cloud)** on Pages.

### Install Docker on the server

```bash
ssh -i your-key.pem ubuntu@<ELASTIC_IP>
sudo apt-get update && sudo apt-get install -y git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
# log out and back in
```

---

## Phase 4 — Deploy the API

On the EC2 instance:

```bash
git clone <your-repo-url> earth-warriors
cd earth-warriors
cp deploy/aws/.env.aws.example .env.aws
nano .env.aws   # fill Neon + Django secret + domains (see below)
```

Generate a Django secret:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

**`.env.aws` checklist**

| Variable | Example |
|----------|---------|
| `API_DOMAIN` | `api.yourdomain.org` |
| `POSTGRES_HOST` | from Neon |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | from Neon |
| `POSTGRES_SSLMODE` | `require` |
| `DJANGO_SECRET_KEY` | long random string |
| `DJANGO_ALLOWED_HOSTS` | `api.yourdomain.org` |
| `CORS_ALLOWED_ORIGINS` | `https://www.yourdomain.org,https://yourdomain.org` |
| `CSRF_TRUSTED_ORIGINS` | same + `https://api.yourdomain.org` |

Start:

```bash
docker compose --env-file .env.aws -f docker-compose.aws.yml up -d --build
docker compose --env-file .env.aws -f docker-compose.aws.yml exec backend python manage.py createsuperuser
```

Check:

```bash
curl -s https://api.yourdomain.org/health/
curl -s https://api.yourdomain.org/api/impact/
```

Admin: `https://api.yourdomain.org/admin/`

### Updates later

```bash
cd earth-warriors && git pull
docker compose --env-file .env.aws -f docker-compose.aws.yml up -d --build
```

---

## Phase 5 — Cloudflare Pages (frontend)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect Git**.
2. Project root: **`frontend`** (or monorepo: set root directory to `frontend`).
3. Build:
   - Command: `npm ci && npm run build`
   - Output directory: `dist`
4. **Environment variables** (Production):
   - `VITE_API_BASE_URL` = `https://api.yourdomain.org/api`
5. Custom domain: `www.yourdomain.org` (and apex redirect if you want).
6. Redeploy after changing env vars.

---

## Phase 6 — Smoke test

| Test | How |
|------|-----|
| Home / research | Open site on Pages |
| Impact API | Home stats if wired to API |
| Water test form | Submit → ticket UUID |
| RSVP | Submit on Ground Work |
| Effluent upload | Small image &lt; 25 MB |
| Admin | Login, list submissions (staff) |

---

## Costs (reminder)

| Service | Typical |
|---------|---------|
| EC2 t4g.small + 30 GB EBS Singapore | ~₹800–950/mo on AWS bill (+ GST) |
| Neon Free | ₹0 |
| Cloudflare Pages | ₹0 |

Effluent files live in Docker volume `backend_media` — monitor with `df -h`; snapshot EC2 volume occasionally (small extra cost).

---

## Troubleshooting

- **502 from Caddy:** `docker compose … logs backend`; wait for healthcheck.
- **DB errors:** verify Neon host, `POSTGRES_SSLMODE=require`, security group allows **outbound** 5432 (default allow all outbound).
- **CORS errors:** match exact Pages URL in `CORS_ALLOWED_ORIGINS` (scheme + host, no trailing slash).
- **Cert errors on API:** use grey-cloud DNS on `api` or switch Caddy to Cloudflare DNS challenge (advanced).

---

## Monthly cost (approximate, INR)

| Item | USD (typical) | INR (~₹85/$) |
|------|---------------|----------------|
| EC2 **t4g.small** | ~$8.2 | ~₹700 |
| EBS **30 GB gp3** | ~$2.4 | ~₹200 |
| Elastic IP (attached) | $0 | ₹0 |
| **AWS subtotal** | **~$10.5** | **~₹900** |

Neon Free and Cloudflare Pages: **$0**.