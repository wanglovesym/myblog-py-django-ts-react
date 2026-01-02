# 📝 My Personal Blog

> 🇨🇳 中文版文档：请查看 [README.zh-CN.md](README.zh-CN.md)
> 🛠 开发指南：请查看 [DEVELOPMENT.md](DEVELOPMENT.md)

A modern, clean, and responsive personal Site built with **Django REST Framework** (backend) and **React + TypeScript** (frontend), featuring Markdown support, category/tag organization, project showcase, and full-text search.

> ✨ **Live Demo**: [https://www.wangshixin.me](https://www.wangshixin.me)  
> 📦 **Tech Stack**: Python 3.12 · Django 5.2 · DRF · PostgreSQL · React 19 · Vite · TypeScript · Tailwind CSS

---

## 📸 Screenshots

<div align="center">

### Home Page

![Home Page](docs/images/home-dark.png)

### Blog Posts

![Blog Posts](docs/images/blog-dark.png)

### Project Showcase

![Projects](docs/images/projects-dark.png)

</div>

---

## 🌟 Features

### Blog

-   ✅ **Post Management**: Markdown editing with syntax highlighting, draft/published status, auto slug generation (Chinese supported)
-   ✅ **Category & Tags**: Posts can belong to one category with multiple tags
-   ✅ **Full-text Search**: Search by title, excerpt, or content
-   ✅ **Code Highlighting**: Beautiful code blocks with highlight.js

### Project Showcase

-   ✅ **Project Portfolio**: Showcase your projects with cover images, tech stack, and live demo links
-   ✅ **Tech Stack Display**: Separate TechStack model with icons and colors
-   ✅ **Status Badges**: Developing / Completed / Online / Offline status indicators
-   ✅ **Featured Projects**: Highlight your best projects on the home page carousel

### General

-   ✅ **Responsive Design**: Mobile, tablet, and desktop friendly
-   ✅ **Dark Mode**: Beautiful dark theme with glassmorphism effects
-   ✅ **Security**: XSS filtering (DOMPurify), CORS configuration, sensitive field protection
-   ✅ **Developer Friendly**: TypeScript type safety, Docker support, decoupled architecture

---

## 🗂️ Project Structure

```bash
myblog-py-django-ts-react/        # Project root
├── myblog-backend-django/        # Django backend
│   ├── blog/                     # Blog app (Post, Category, Tag)
│   ├── project/                  # Project app (Project, TechStack)
│   ├── config/                   # Project settings (settings, urls, wsgi)
│   ├── manage.py
│   └── requirements.txt
│
├── myblog-frontend-react/        # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/               # Page components (Home, Post, Projects, etc.)
│   │   ├── components/          # Shared components (Header, CategoryList, etc.)
│   │   ├── config/              # API and social link configuration
│   │   └── types/               # TypeScript interface definitions
│   ├── tailwind.config.js
│   └── package.json
│
├── deploy/                       # Deployment scripts (nginx, certbot, etc.)
├── docs/                         # Documentation and images
├── docker-compose.dev.yml        # Development Docker Compose
├── docker-compose.prod.yml       # Production Docker Compose
└── README.md                     # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

-   Docker & Docker Compose
-   Git
-   Make (optional, for convenience commands)

### 1. Clone the repository

```bash
git clone git@github.com:wanglovesym/myblog-py-django-ts-react.git
cd myblog-py-django-ts-react
```

### 2. Configure environment variables

```bash
# Create environment file from template
cp .env.dev.example .env.dev

# Edit if needed (default values work for local development)
```

### 3. Start development environment

```bash
# Using Make (recommended)
make init          # First time: start containers + run migrations

# Or manually with Docker Compose
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

### 4. Create admin user and start creating content

```bash
make superuser     # Follow prompts to create admin account
```

Then visit:

-   🌐 **Frontend**: http://localhost:5173
-   💻 **Backend API**: http://localhost:8000/api/
-   🔐 **Admin Panel**: http://localhost:8000/admin/

### Common Development Commands

```bash
make dev-up-d           # Start in background
make dev-down           # Stop all containers
make dev-logs           # View logs
make dev-rebuild        # Rebuild after dependency changes
make shell              # Enter backend container shell
make migrate            # Run database migrations
make help               # Show all available commands
```

---

## 🐳 Docker Support

This project includes **production-ready Docker Compose** configuration with:

-   ✅ **Multi-service orchestration**: Nginx (reverse proxy) + Django (Gunicorn) + React (static) + PostgreSQL
-   ✅ **Health monitoring**: Built-in healthcheck endpoints for all services
-   ✅ **HTTPS support**: Let's Encrypt integration with automatic renewal
-   ✅ **Version tracking**: Git commit SHA injected into backend builds

```bash
# Production deployment (requires server with Docker)
docker compose -f docker-compose.prod.yml up -d
```

> See **Production Deployment** section below for detailed setup instructions.

---

## 🚀 Production Deployment

### Prerequisites

-   Ubuntu server (20.04+ recommended)
-   Docker & Docker Compose installed
-   Domain name with DNS pointing to your server IP
-   Ports 80 and 443 open

### Quick Deploy

**1. Clone and configure environment**

```bash
git clone git@github.com:yourname/myblog-py-django-ts-react.git
cd myblog-py-django-ts-react

# Create production environment file
cp .env.prod.example .env.prod
# Edit with your values: SECRET_KEY, DB passwords, VITE_API_BASE_URL, etc.
```

**2. Deploy the application**

```bash
# Deploy: build images + start services + run migrations
./scripts/deploy.sh
```

**3. Setup HTTPS certificate** (after DNS is configured)

```bash
./scripts/setup-ssl.sh
```

### Management Commands

```bash
# View service logs
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f proxy

# Restart specific service
docker compose -f docker-compose.prod.yml restart backend

# Database backup
./scripts/backup.sh

# Check container status
docker compose -f docker-compose.prod.yml ps
```

### Production Architecture

```
Internet (HTTPS:443)
			 ↓
	Nginx Proxy (container)
	- SSL termination
	- HSTS + security headers
	- Static file serving
			 ↓
	┌─────────┬──────────┐
	↓         ↓          ↓
Backend  Frontend   Static Files
(Gunicorn) (Nginx)   (Django collectstatic)
	↓
PostgreSQL
(persistent volume)
```

### Key Features

-   🔒 **Automatic HTTPS**: Let's Encrypt with 90-day auto-renewal
-   📊 **Health Monitoring**: `/api/health/` endpoint with DB status + version info
-   🏷️ **Version Tracking**: Git commit SHA embedded in backend builds
-   🔐 **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
-   📦 **Zero-downtime Updates**: Rolling restart support via Docker Compose

> 💡 **Tip**: All deployment scripts are located in `scripts/` directory. Use `deploy.sh` for deployment, `setup-ssl.sh` for certificate management, and `backup.sh` for database backups.

---

## 🌐 Frontend on Vercel (Recommended)

This project supports deploying the frontend to **Vercel** for global CDN acceleration and zero-ops hosting while keeping the backend on your server.

-   **Environment variables**

    -   Frontend reads `VITE_API_BASE_URL` to locate the backend API
    -   Local dev: `http://localhost:8000`
    -   Production: `https://api.wangshixin.me`

-   **Files added**

    -   `myblog-frontend-react/src/config/api.ts`: Centralized API base URL config
    -   `.env.development` / `.env.production`: Environment variable templates
    -   `myblog-frontend-react/vercel.json`: SPA fallback routing (see below)

-   **SPA routing fallback (fixes 404 on deep links)**
    -   Symptom: direct visits like `/post/<slug>` return 404 on Vercel
    -   Fix: add `vercel.json` to rewrite unmatched routes to `/index.html`
    -   Behavior: static assets resolve via filesystem first, then fallback to SPA

```json
{
    "routes": [
        { "handle": "filesystem" },
        { "src": "/(.*)", "dest": "/index.html" }
    ]
}
```

-   **Backend CORS/CSRF**

    -   `CORS_ALLOWED_ORIGINS` must include your frontend domains
    -   `CSRF_TRUSTED_ORIGINS` must include both API and frontend HTTPS domains

-   **Custom domain**
    -   Bind `www.wangshixin.me` in Vercel → Domains
    -   DNS: CNAME `www` → `cname.vercel-dns.com` (recommended) or A `76.76.21.21`
    -   HTTPS is auto-provisioned via Let's Encrypt

> For a step-by-step guide, see `myblog-frontend-react/VERCEL_DEPLOYMENT.md`.

---

## 🛠️ Built With

### Backend

-   **[Django ](https://www.djangoproject.com/)**– Web framework
-   **[Django REST Framework ](https://www.django-rest-framework.org/)**– API toolkit
-   **[django-filter ](https://django-filter.readthedocs.io/)**– Advanced filtering
-   **[gunicorn ](https://gunicorn.org/)**– Production WSGI server

### Frontend

-   **[React ](https://react.dev/)**– UI library
-   **[TypeScript ](https://www.typescriptlang.org/)**– Typed JavaScript
-   **[Vite ](https://vitejs.dev/)**– Next-gen build tool
-   **[Tailwind CSS ](https://tailwindcss.com/)**– Utility-first CSS framework
-   **[marked + DOMPurify ](https://github.com/markedjs/marked)**– Secure Markdown rendering

---

## 📄 License

This project is for personal use. Feel free to use it as a reference or template for your own blog.

---

## 🙌 Author

-   **Shixin Wang (Jayden)** – shixinw998@gmail.com

> "💌 **Feedback welcome!** If you find this project helpful, consider giving it a star ⭐ on GitHub. "
