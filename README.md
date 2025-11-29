# 📝 My Personal Blog

> 🇨🇳 中文版文档：请查看 `README.zh-CN.md`

A modern, clean, and responsive personal blog built with **Django REST Framework** (backend) and **React + TypeScript** (frontend), featuring Markdown support, category/tag organization, and full-text search.

> ✨ **Live Demo**: [Coming soon...]  
> 📦 **Tech Stack**: Python 3.12 · Django 5.2 · DRF · PostgreSQL · React 19 · Vite · TypeScript · Tailwind CSS

---

## 🌟 Features

-   ✅ **文章管理**：Markdown 编辑、草稿/发布状态、自动 slug 生成（支持中文）
-   ✅ **分类 & 标签**：文章可归属一个分类，打多个标签
-   ✅ **全文搜索**：按标题、摘要、正文模糊搜索
-   ✅ **响应式设计**：适配手机、平板、桌面
-   ✅ **安全防护**：XSS 过滤（DOMPurify）、CORS 配置、敏感字段保护
-   ✅ **开发者友好**：TypeScript 类型安全、Docker 支持、前后端分离架构

---

## 🗂️ Project Structure

```bash
myblog-py-django-ts-react/      # 项目根目录
├── myblog-backend-django/      # Django 后端
│   ├── blog/                   # 博客核心应用
│   ├── myblog/                 # 项目配置
│   ├── manage.py
│   └── requirements.txt
│
├── myblog-frontend-react/      # React + TypeScript 前端
│   ├── src/
│   │   ├── pages/             # 页面组件（Home, Post, Category, Tag 等）
│   │   ├── components/        # 通用组件（Header, CategoryList 等）
│   │   └── types/             # TypeScript 接口定义
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md                   # 本文件
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

-   Python 3.12+
-   Node.js 18+ (LTS)
-   Git

### 1. Clone the repository

```bash
git clone git@github.com:yourname/myblog-py-django-ts-react.git
cd myblog-py-django-ts-react
```

### 2. Start the backend (Django)

```bash
# Navigate to backend
cd myblog-backend-django

# Create virtual environment
python3.12 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser (follow prompts)
python manage.py createsuperuser

# Start development server
python manage.py runserver
# → API available at http://127.0.0.1:8000/api/
```

### 3. Start the frontend (React + Vite)

```bash
# Open a new terminal
cd myblog-frontend-react

# Install dependencies
npm install

# Start dev server
npm run dev
# → Frontend available at http://localhost:5173
```

### 4. Write your first post

-   Visit `http://127.0.0.1:8000/admin`
-   Log in with your superuser credentials
-   Create a **Category**, **Tag**, and **Post** (remember to uncheck "Is draft")

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
cp .env.prod.django.example .env.prod.django
# Edit with your values: SECRET_KEY, DB passwords, etc.
```

**2. Run HTTPS certificate setup** (first-time only)

```bash
# Test with staging environment first (recommended)
sudo ./deploy/certbot_setup.sh --domain=api.yourdomain.com --email=you@example.com --staging

# Once validated, apply for production certificate
sudo ./deploy/certbot_setup.sh --domain=api.yourdomain.com --email=you@example.com
```

**3. Deploy using management script**

```bash
# Full deployment: build images + start services
./deploy/manage_prod.sh deploy-full

# Or step by step:
./deploy/manage_prod.sh build      # Build images with version tag
./deploy/manage_prod.sh up         # Start/update containers
./deploy/manage_prod.sh status     # Check running status
```

### Management Commands

```bash
# View service logs
./deploy/manage_prod.sh logs backend
./deploy/manage_prod.sh logs proxy

# Restart specific service
./deploy/manage_prod.sh restart backend

# Health check & system diagnostics
./deploy/manage_prod.sh self-test

# Certificate renewal (auto-renewed, manual test)
./deploy/manage_prod.sh renew-dry-run
./deploy/manage_prod.sh renew

# See all available commands
./deploy/manage_prod.sh help
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

> 💡 **Tip**: All deployment scripts are located in `deploy/` directory. Review `manage_prod.sh` for remote SSH operations and `certbot_setup.sh` for certificate management details.

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
