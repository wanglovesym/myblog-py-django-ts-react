# Docker 开发环境完整使用指南

## 📋 概述

本项目使用 Docker Compose 实现开发环境容器化，支持前后端热重载、数据库持久化与快速启动。

**技术栈**

-   后端：Django 5.2 + Django REST Framework + PostgreSQL 16
-   前端：React 19 + TypeScript + Vite 7
-   容器编排：Docker Compose

**分支说明**

-   `dev/docker`：容器化改动在此分支完成
-   `main`：稳定版本，容器化验证后合并

---

## 🗂️ 项目结构

```
myblog-py-django-ts-react/
├── myblog-backend-django/          # Django 后端
│   ├── Dockerfile                  # 后端生产镜像（支持 Postgres）
│   ├── .dockerignore               # 构建时忽略的文件
│   ├── requirements.txt            # Python 依赖（含 psycopg 3）
│   └── myblog/settings.py          # 支持环境变量配置
├── myblog-frontend-react/          # React 前端
│   ├── Dockerfile                  # 前端生产镜像（Nginx）
│   ├── Dockerfile.dev              # 前端开发镜像（Vite）
│   ├── .dockerignore               # 构建时忽略的文件
│   └── vite.config.ts              # 代理配置（/api → backend）
├── docker-compose.dev.yml          # 开发环境编排
├── .env.dev.django                 # 后端环境变量（不提交）
├── .env.dev.django.example         # 环境变量模板
└── DOCKER_DEV_GUIDE.md             # 本文档
```

---

## ⚙️ 环境准备

### 前置要求

-   **Docker Desktop**（macOS/Windows）或 Docker Engine（Linux）
-   可用端口：`5173`（前端）、`8000`（后端）、`5432`（数据库）
-   本地未运行同项目的非容器版本

### 环境变量配置

1. 复制模板文件：

```bash
cp .env.dev.django.example .env.dev.django
```

2. 检查配置（通常无需修改）：

```bash
cat .env.dev.django
```

**关键配置说明**

-   `DEBUG=1`：开启调试模式（生产必须为 `0`）
-   `POSTGRES_*`：数据库连接参数（注释掉则使用 SQLite）
-   `CORS_ALLOW_ALL_ORIGINS=true`：开发环境允许跨域

---

## 🚀 启动开发环境

### 一键启动（推荐）

```bash
# 进入项目根目录
cd /Users/jayden/development/practice/multi-lang/myblog-py-django-ts-react

# 构建并启动所有服务（前台运行，查看日志）
docker compose -f docker-compose.dev.yml up --build
```

**首次启动需要**

-   构建镜像（约 3-5 分钟）
-   下载 Postgres 镜像
-   安装前后端依赖

### 后台启动

```bash
# -d 表示后台运行
docker compose -f docker-compose.dev.yml up -d --build
```

### 查看日志

```bash
# 查看所有服务日志
docker compose -f docker-compose.dev.yml logs -f

# 只看后端日志
docker compose -f docker-compose.dev.yml logs -f backend

# 只看前端日志
docker compose -f docker-compose.dev.yml logs -f frontend
```

---

## 🗄️ 数据库操作

### 执行迁移

```bash
# 首次启动或修改模型后执行
docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

### 创建超级用户

```bash
docker compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
```

按提示输入用户名、邮箱和密码。

### 访问 Admin 后台

启动后访问：http://localhost:8000/admin/

### 数据持久化

数据库数据存储在 Docker 卷 `pg_data` 中，容器重启不会丢失。

**查看卷**

```bash
docker volume ls | grep pg_data
```

**删除数据（慎用）**

```bash
docker compose -f docker-compose.dev.yml down -v
```

---

## 🌐 访问地址

| 服务         | 地址                         | 说明            |
| ------------ | ---------------------------- | --------------- |
| 前端开发站点 | http://localhost:5173        | Vite 热重载     |
| 后端 API     | http://localhost:8000/api/   | Django REST API |
| Admin 后台   | http://localhost:8000/admin/ | 管理界面        |
| 数据库       | localhost:5432               | 本地调试用      |

**代理规则**

-   前端通过 Vite 代理 `/api` 请求到 `http://backend:8000/api`
-   Docker 网络中服务之间使用服务名访问（如 `backend`、`db`）

---

## 🔄 开发工作流

### 热重载机制

**前端（Vite）**

-   修改 `.tsx`/`.css` 文件 → 自动刷新浏览器
-   挂载 `./myblog-frontend-react:/app`

**后端（runserver）**

-   修改 `.py` 文件 → 自动重启服务器
-   挂载 `./myblog-backend-django:/app`

**无需重建镜像**：代码变更会立即生效！

### 何时需要重建镜像

-   修改 `requirements.txt`（Python 依赖）
-   修改 `package.json`（Node 依赖）
-   修改 `Dockerfile`

```bash
# 重建后端
docker compose -f docker-compose.dev.yml build --no-cache backend

# 重建前端
docker compose -f docker-compose.dev.yml build --no-cache frontend
```

---

## 🛠️ 常用命令

### 容器管理

```bash
# 停止所有服务
docker compose -f docker-compose.dev.yml down

# 停止并删除卷（清空数据库）
docker compose -f docker-compose.dev.yml down -v

# 重启某个服务
docker compose -f docker-compose.dev.yml restart backend

# 查看运行状态
docker compose -f docker-compose.dev.yml ps
```

### 进入容器调试

```bash
# 进入后端容器
docker compose -f docker-compose.dev.yml exec backend bash

# 进入数据库
docker compose -f docker-compose.dev.yml exec db psql -U myblog -d myblog
```

### Django 管理命令

```bash
# 创建迁移文件
docker compose -f docker-compose.dev.yml exec backend python manage.py makemigrations

# 收集静态文件（生产环境需要）
docker compose -f docker-compose.dev.yml exec backend python manage.py collectstatic --noinput

# 创建应用
docker compose -f docker-compose.dev.yml exec backend python manage.py startapp <app_name>
```

---

## ❗ 常见问题

### 1. 浏览器强制使用 HTTPS 导致 `ERR_SSL_PROTOCOL_ERROR`

**原因**：浏览器缓存了 HSTS 策略，强制将 `http://localhost` 升级到 `https://`

**解决**

-   **Chrome**：访问 `chrome://net-internals/#hsts` → 删除 `localhost`
-   **隐私模式**：直接用隐私窗口访问 `http://localhost:5173`

### 2. 端口被占用

**报错**：`bind: address already in use`

**解决**

```bash
# 查找占用端口的进程（以 8000 为例）
lsof -i :8000

# 杀死进程
kill -9 <PID>
```

### 3. 前端报 `npm not found`

**原因**：开发环境未使用 `Dockerfile.dev`

**解决**：检查 `docker-compose.dev.yml` 中前端服务是否指定：

```yaml
frontend:
    build:
        dockerfile: Dockerfile.dev
```

### 4. 数据库连接失败

**检查步骤**

```bash
# 1. 确认数据库已启动
docker compose -f docker-compose.dev.yml ps db

# 2. 查看健康检查状态
docker compose -f docker-compose.dev.yml logs db | grep healthy

# 3. 检查环境变量
docker compose -f docker-compose.dev.yml exec backend env | grep POSTGRES
```

### 5. 镜像构建失败

```bash
# 清理缓存重新构建
docker compose -f docker-compose.dev.yml build --no-cache

# 清理所有未使用的镜像/卷
docker system prune -a --volumes
```

---

## 🔄 SQLite ↔️ Postgres 切换

### 切换到 SQLite

1. 编辑 `.env.dev.django`，注释数据库变量：

```bash
# POSTGRES_DB=myblog
# POSTGRES_USER=myblog
# POSTGRES_PASSWORD=myblog
# POSTGRES_HOST=db
# POSTGRES_PORT=5432
```

2. 重启后端：

```bash
docker compose -f docker-compose.dev.yml restart backend
```

### 切换到 Postgres

1. 恢复 `.env.dev.django` 中的注释
2. 重启后端并迁移：

```bash
docker compose -f docker-compose.dev.yml restart backend
docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

---

## ✅ 验证清单

启动后依次检查：

-   [ ] 前端页面正常访问：http://localhost:5173
-   [ ] 后端 API 返回数据：`curl http://localhost:8000/api/posts/`
-   [ ] Admin 后台可登录：http://localhost:8000/admin/
-   [ ] 数据库健康检查通过：`docker compose -f docker-compose.dev.yml ps`
-   [ ] 前端能正常请求后端（Network 面板无 CORS 错误）
-   [ ] 修改代码后热重载生效

---

## 📦 提交与分支管理

### 提交改动

```bash
git add -A
git commit -m "feat(docker): 完成开发环境容器化（后端 Postgres + 前端 Vite）"
git push
```

### 与 main 同步

```bash
# 拉取最新 main
git fetch origin

# 变基（推荐）
git rebase origin/main

# 或合并
git merge origin/main
```

### 创建 Pull Request

```bash
# 使用 GitHub CLI（如果已安装）
gh pr create --base main --head dev/docker --title "Docker 容器化" --fill
```

---

## 🚢 下一步：生产环境

开发环境验证通过后，可以继续：

1. **创建 `docker-compose.prod.yml`**

    - Gunicorn 替代 runserver
    - Nginx 反向代理（HTTPS 终止）
    - 前端静态文件优化

2. **环境变量管理**

    - `.env.prod.django`（生产配置）
    - 敏感信息用 Secrets 管理

3. **CI/CD**

    - GitHub Actions 自动构建镜像
    - 推送到 Docker Hub / GHCR
    - 自动部署到 VPS / 云平台

4. **部署平台选择**
    - VPS + Docker Compose（最灵活）
    - Render / Fly.io（托管容器）
    - Kubernetes（大规模）

---

## 📚 参考资源

-   [Docker Compose 官方文档](https://docs.docker.com/compose/)
-   [Django 部署检查清单](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
-   [Vite 代理配置](https://vite.dev/config/server-options.html#server-proxy)
-   [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

## 💡 提示

-   **开发模式不要用 `--build` 频繁重建**：只在依赖变化时重建
-   **生产环境禁用 DEBUG**：`DEBUG=0` 并配置 `ALLOWED_HOSTS`
-   **定期备份数据库**：用 `pg_dump` 导出数据
-   **监控容器资源**：`docker stats` 查看 CPU/内存占用

---

**文档版本**：1.0  
**最后更新**：2025-11-27  
**维护者**：开发团队
