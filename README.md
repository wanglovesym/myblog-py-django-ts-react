# 📝 My Personal Blog

A modern, clean, and responsive personal blog built with **Django REST Framework** (backend) and **React + TypeScript** (frontend), featuring Markdown support, category/tag organization, and full-text search.

> ✨ **Live Demo**: [Coming soon...]  
> 📦 **Tech Stack**: Python 3.12 · Django 5.2 · DRF · PostgreSQL · React 19 · Vite · TypeScript · Tailwind CSS

---

## 🌟 Features

- ✅ **文章管理**：Markdown 编辑、草稿/发布状态、自动 slug 生成（支持中文）
- ✅ **分类 & 标签**：文章可归属一个分类，打多个标签
- ✅ **全文搜索**：按标题、摘要、正文模糊搜索
- ✅ **响应式设计**：适配手机、平板、桌面
- ✅ **安全防护**：XSS 过滤（DOMPurify）、CORS 配置、敏感字段保护
- ✅ **开发者友好**：TypeScript 类型安全、Docker 支持、前后端分离架构

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

- Python 3.12+
- Node.js 18+ (LTS)
- Git

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

- Visit `http://127.0.0.1:8000/admin`
- Log in with your superuser credentials
- Create a **Category**, **Tag**, and **Post** (remember to uncheck "Is draft")

---

## 🐳 Docker Support (Coming Soon)

This project is being prepared for Docker containerization (Stage 4). Once complete, you’ll be able to:

```bash
docker-compose up --build
```

to run the entire stack (Django + PostgreSQL + React dev server) in one command.

---

## 📦 Deployment

### Frontend
Deploy to [Vercel](https://vercel.com/) (free, automatic HTTPS, global CDN)

### Backend
Deploy to [Render](https://render.com/) or [Fly.io](https://fly.io/) (free tier available)

**Render Build Command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**Render Start Command:**
```bash
gunicorn myblog.wsgi:application
```

**Required Environment Variables:**
- `SECRET_KEY` - Your Django secret key (generate a strong random key)
- `ALLOWED_HOSTS` - Your deployment domain (e.g., `your-app.onrender.com`)
- `DATABASE_URL` - PostgreSQL connection string (optional, defaults to SQLite)

> 📌 **Note**: The project is pre-configured with WhiteNoise for serving static files in production. No additional web server configuration is needed for CSS/JS files.

---

## 🛠️ Built With

### Backend

- **[Django ](https://www.djangoproject.com/)**– Web framework
- **[Django REST Framework ](https://www.django-rest-framework.org/)**– API toolkit
- **[django-filter ](https://django-filter.readthedocs.io/)**– Advanced filtering
- **[gunicorn ](https://gunicorn.org/)**– Production WSGI server

### Frontend

- **[React ](https://react.dev/)**– UI library
- **[TypeScript ](https://www.typescriptlang.org/)**– Typed JavaScript
- **[Vite ](https://vitejs.dev/)**– Next-gen build tool
- **[Tailwind CSS ](https://tailwindcss.com/)**– Utility-first CSS framework
- **[marked + DOMPurify ](https://github.com/markedjs/marked)**– Secure Markdown rendering

---

## 📄 License

This project is for personal use. Feel free to use it as a reference or template for your own blog.

---

## 🙌 Author

- **Shixin Wang (Jayden)** – shixinw998@gmail.com

> "💌 **Feedback welcome!** If you find this project helpful, consider giving it a star ⭐ on GitHub. "