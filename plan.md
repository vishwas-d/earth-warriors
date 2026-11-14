# Context & Purpose
Act as a Principal Full-Stack Engineer and Lead Product Designer. You are tasked with designing and building the complete v0 (MVP) web application for "Earth Warriors", a premier environmental NGO based in Delhi NCR dedicated to the restoration and protection of the Yamuna River.

Earth Warriors is a highly authoritative, science-backed, research-driven, and legally active organization. Our work spans multiple high-impact fronts:
1. **Scientific Research & Lab Testing:** Conducting independent water quality testing (via our free lab in Noida), monitoring industrial effluent drains and STP/CETP outlets, and benchmarking parameters against BIS standards (BOD, COD, TSS, TDS, Fecal Coliform).
2. **Viral Exposé & Media Impact:** Publishing investigative video exposés of malfunctioning STPs/CETPs that have gone viral, successfully drawing immediate attention from authorities and forcing corrective action.
3. **Legal & Government Accountability:** Drafting legal interventions for the NGT and Delhi High Court, writing official letters to government bodies (CMO Delhi, DJB, I&FD), and maintaining a rigorous transparency/RTI repository.
4. **Active Campaigns & Demonstrations:** Organizing high-visibility public demonstrations and placard campaigns at pollution hotspots to flag reporting discrepancies and mobilize citizens.
5. **Grassroots Community Action:** Hosting weekly Sunday cleanup drives followed by **"Yamuna Samvaad"**—open-air community circles where citizens, experts, and volunteers discuss philosophy, public welfare, social good, and current affairs.
6. **Media Recognition:** Widely covered across major national TV channels, print, and digital media.

The website must look exceptionally sleek, modern, executive, and trustworthy—comparable to a top-tier tech platform or international research institute. It should convey high operational competence, scientific rigor, and deep grassroots engagement.

---

# Asset Directory Note
- All related visual, media, and document assets (such as NGO logos, media outlet logos, viral video thumbnails, STP expose clips, water sample photos, government letter PDFs, and cleanup drive/Samvaad photos) are present locally inside the `./earth-warriors/assets/` directory. 
- Please reference and load static media files directly from this folder in the frontend components and backend media settings.

---

# Dockerization & Containerization Requirements
The entire project must be fully Dockerized for both local development and production environments.

1. **`Dockerfile.frontend` (ReactJS SPA):**
   - Multi-stage Docker build using `node:20-alpine` to build Vite static assets, served via `nginx:alpine` in production.
   - Configure Nginx to route all traffic to `index.html` for React Router SPA deep linking support.

2. **`Dockerfile.backend` (Django API):**
   - Multi-stage or optimized image using `python:3.11-slim`.
   - Install system dependencies for PostgreSQL (`libpq-dev`), copy requirements, run database migrations, collect static files, and serve using `gunicorn` or `uvicorn`.

3. **`docker-compose.yml` (Orchestration):**
   - Define services: `db` (PostgreSQL 15), `backend` (Django DRF), and `frontend` (React + Nginx).
   - Configure environment variables, volume mounts for local development hot-reloading, database persistence (`postgres_data`), and static/media volumes (mounting `./earth-warriors/assets/`).
   - Define network bridging so the React frontend container can cleanly communicate with the Django API container.

---

# Tech Stack & System Architecture

### Frontend (ReactJS SPA)
- **Framework:** ReactJS with Vite (`npm create vite@latest`) & TypeScript
- **Routing:** React Router v6 (`react-router-dom`)
- **Styling:** Tailwind CSS + Shadcn UI (React) + Lucide React icons (`lucide-react`)
- **Animations:** Framer Motion (`framer-motion`) for smooth scroll transitions and micro-interactions
- **Color Palette:** Deep slate navy (`#0F172A`), rich emerald green (`#059669`), river blue (`#0284C7`), crisp light gray background (`#F8FAFC`), and stark white (`#FFFFFF`).

### Backend & Database
- **Framework:** Python / Django (Django REST Framework with CORS headers enabled via `django-cors-headers`)
- **Database:** PostgreSQL
- **Authentication & RBAC:** JWT / Session Authentication with Role-Based Access Control:
  - `Admin` (Full system and user management access)
  - `Researcher` (Can publish water reports, legal letters, RTI documents, and blogs)
  - `Volunteer Manager` (Can manage Sunday drives, upload gallery photos, update waste metrics, post press coverage, and log Samvaad sessions)
  - `Public/User` (Read-only access, can submit water test requests or report illegal effluent)

### Core Backend Data Models
- **User:** Extended AbstractUser with `role` choices (`ADMIN`, `RESEARCHER`, `VOLUNTEER_MGR`, `PUBLIC`).
- **BlogPost:** `title`, `slug`, `content_markdown`, `author`, `cover_image`, `category`, `parameters_covered` (e.g., BOD, COD, TSS, TDS, Fecal Coliform), `published_at`, `created_at`.
  - *Sorting Rule:* API must serve blog posts sorted chronologically by `published_at DESC` (newest first).
- **MediaCoverage:** `outlet_name`, `outlet_logo_url`, `headline`, `article_url`, `media_type` (`Print`, `Digital`, `TV/Video`), `published_date`, `summary`, `is_featured`.
- **GovernmentLetter & RTI:** `title`, `issuing_body` (CMO Delhi, DJB, I&FD, CPCB, DPCC), `document_pdf_url`, `letter_date`, `status` (`Sent`, `Awaiting Reply`, `Escalated to NGT`, `Responded`), `summary`.
- **GroundworkDrive:** `location_ghat`, `drive_date`, `volunteers_attended`, `waste_collected_kg`, `samvaad_topic` (e.g., "Philosophy of Water & Public Stewardship"), `gallery_images`, `status` (`Upcoming`, `Completed`).
- **ExposeVideo:** `title`, `facility_name` (e.g., Okhla STP, Rohini CETP), `video_url`, `thumbnail_url`, `authority_action_taken` (Boolean/Text), `published_date`.
- **ActiveCampaign:** `campaign_title`, `hotspot_location`, `placard_slogan`, `photos`, `impact_summary`, `date`.
- **WaterTestResult:** `sample_location`, `source_type` (`Groundwater`, `Drain`, `STP/CETP Outlet`, `River Ghat`), `bod`, `cod`, `tss`, `tds`, `fecal_coliform`, `bis_compliance_status` (`Compliant`, `Hazardous`), `tested_at`.
- **WaterTestRequest:** `applicant_name`, `email`, `phone`, `address_noida`, `water_source_type`, `ticket_id`, `status` (`Received`, `Sample Collected`, `Testing in Progress`, `Report Ready`).
- **EffluentReport:** `reporter_name` (optional), `location_drain`, `description`, `photo_url`, `submitted_at`, `status` (`Pending Verification`, `Verified`, `Escalated`).

---

# Information Architecture & Page Requirements (5 Core Pages)

Design a clean, responsive top Navigation Header with links to all 5 primary pages, a prominent **"Request Free Water Test"** primary CTA button, and an executive Footer featuring contact channels, social links, Noida lab location details, and legal disclaimers. Use React Router `NavLink` for client-side routing.

### Page 1: Home Page (`/`)
1. **Hero Section:**
   - Headline: *"Science-Backed Action, Public Accountability & Grassroots Awakening for the Yamuna."*
   - Subtitle highlighting investigative exposés, legal battles, free groundwater testing, Sunday cleanups, and Yamuna Samvaad.
   - Dual CTAs: `[Explore Our Research & Exposés]` and `[Join This Sunday's Drive]`.
   - **Impact Counter Ribbon:** Real-time data grid displaying:
     - `Total Waste Collected (Kgs)`
     - `Sunday Drives & Samvaads Conducted`
     - `Free Water Samples Tested (Noida Lab)`
     - `Legal Petitions & Government Letters Filed`
2. **"As Seen On" Media Recognition Bar:**
   - Sleek logo strip of major media channels and newspapers that have covered Earth Warriors' investigative findings (using logos from `./earth-warriors/assets/media/`).
3. **"Our 3 Pillars of Impact" Grid:**
   - *Pillar 1: Scientific Field Research & Viral Exposés* (Noida lab, STP/CETP outlet monitoring, viral video investigations driving authority action).
   - *Pillar 2: Legal Advocacy & Active Campaigns* (NGT petitions, placard protests at hotspots, RTI & government letters).
   - *Pillar 3: Grassroots Action & Yamuna Samvaad* (Weekly Sunday cleanups followed by intellectual public-welfare discourse).
4. **Featured Viral STP Exposé Spotlight:**
   - Video card highlighting our viral investigations that forced official accountability.
5. **Upcoming Sunday Drive & Samvaad Card:**
   - Location, cleanup timings, Samvaad discussion theme, and an embedded RSVP trigger.

### Page 2: Research (`/research`)
1. **Government Correspondence & Legal Repository Hub:**
   - Filterable, searchable data table listing official letters sent to CMO Delhi, DJB, I&FD, and CPCB.
   - Status badges and direct PDF preview links (pointing to document assets in `./earth-warriors/assets/docs/`).
2. **Viral STP & CETP Investigative Reports:**
   - Dedicated video showcase and field logs covering major industrial effluent entry points and malfunctioning treatment plants.
3. **Water Quality Parameter Science Center:**
   - Educational breakdown explaining key water health metrics: **BOD, COD, TSS, TDS, and Fecal Coliform**, complete with acceptable BIS threshold limits.
4. **Fact-Checking & Discrepancy Ledger:**
   - Side-by-side evidence cards debunking false public claims regarding Yamuna pollution using independent lab data.

### Page 3: Ground Work (`/ground-work`)
1. **Free Noida Water Testing Lab Portal:**
   - Highlights the zero-cost groundwater testing service for local Noida/Delhi-NCR residents with an embedded request form generating a tracking ticket ID.
2. **Citizen Effluent Reporting Tool:**
   - Quick report form allowing citizens to upload photos/videos and log locations of illegal industrial waste discharge into drains.
3. **Weekly Sunday Cleanup Drives & Yamuna Samvaad Center:**
   - Schedule for upcoming drives and Samvaad discussion topics.
   - Gallery grid of past cleanups and Samvaad circles (philosophy, public welfare, current affairs).
4. **Active Campaigns & Placard Protest Demonstrations:**
   - Showcase of our on-the-ground protest campaigns at pollution hotspots flagging report discrepancies.
5. **Drive Tonnage & Waste Analytics:**
   - Visual charts detailing waste composition and total tonnage collected over time. Mark this point as upcoming

### Page 4: Blogs & News (`/blogs`)
1. **Blog & News Listing Architecture:**
   - Chronological algorithm sorting posts by `published_at DESC` (newest first).
   - Category filters: `Scientific Analysis`, `Legal & Government Updates`, `Field Dispatches`, `Fact Checks`, `Media & Press Releases`, `Yamuna Samvaad Insights`.
   - Rich card layout with reading time, author metadata, category tag, publication date, and thumbnail.
2. **Blog Post Article Layout (`/blogs/:slug`):**
   - Clean, long-form typography layout with support for embedded video, data tables, parameter callouts, and PDF attachment links.

### Page 5: Impact & About Us (`/about`)
1. **Mission Statement & Scientific Philosophy:**
   - The founding ethos of Earth Warriors and our evidence-based approach to environmental enforcement and social good.
2. **Media Coverage & In The Press Hub:**
   - Dedicated showcase grid displaying news articles, video reports, TV interviews, and press mentions about Earth Warriors with direct external links.
   - Downloadable Press Kit (logos, mission brief, executive contacts).
3. **Team & Scientific Advisory Board:**
   - Executive profile grid featuring legal minds, researchers, water analysts, and core field team leaders.
4. **Aggregated Impact Metrics & Timeline:**
   - Visual trajectory of waste removed, cases fought, and water samples analyzed since inception.
5. **Noida Lab Location & Contact:**
   - Address, contact information for lab visits, media inquiries, and volunteer onboarding.

---

# Execution Deliverables
1. Build out the complete ReactJS Vite project structure with React Router configuration (`App.tsx`), reusable UI components (Cards, Data Tables, Badges, Stat Counters, Sliders, Media Logo Strip), and Tailwind CSS setup, referencing static files from `./earth-warriors/assets/`.
2. Populate all React pages and components with realistic data for water parameters, blog posts, government letters, viral exposé videos, placard campaign logs, Yamuna Samvaad topics, media press coverage, and cleanup drives.
3. Implement clean Django REST Framework serializers and views handling blog sorting, media coverage endpoints, water test request submissions, and impact counter endpoints with CORS configured for ReactJS (`django-cors-headers`).
4. Generate `Dockerfile.frontend`, `Dockerfile.backend`, and `docker-compose.yml` configuration files so the entire application stack can be spun up seamlessly with a single `docker compose up --build` command.