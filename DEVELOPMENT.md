# 开发指南 (Development Guide)

本文档说明项目的开发流程、环境配置与最佳实践。

---

## 📋 目录

-   [分支管理策略](#分支管理策略)
-   [推荐开发方式](#推荐开发方式)
-   [日常工作流程](#日常工作流程)
-   [常见问题](#常见问题)

---

## 🌲 分支管理策略

采用简化版 Git Flow：

```
main                 # 生产环境分支（稳定代码）
├── dev/frontend     # 前端功能开发
├── dev/backend      # 后端功能开发
├── feature/*        # 其他新功能
└── bugfix/*         # 错误修复
```

### 创建新功能分支

```bash
# 从 main 创建新分支
git checkout main
git pull origin main
git checkout -b dev/your-feature-name

# 或从当前位置创建
git checkout -b dev/your-feature-name
```

### 合并回主分支

```bash
# 完成开发后
git checkout main
git pull origin main
git merge dev/your-feature-name
git push origin main

# 删除本地分支（可选）
git branch -d dev/your-feature-name

# 删除远程分支（可选）
git push origin --delete dev/your-feature-name
```

---

## 🚀 推荐开发方式

本项目推荐以下两种方式进行开发与调试：

### 方式 A ｜完整 Docker（首选，一致性最佳）

```bash
# 在项目根目录
docker compose -f docker-compose.dev.yml up --build

# 后台运行（可选）
docker compose -f docker-compose.dev.yml up -d --build
```

-   ✅ 与生产环境高度一致（PostgreSQL、网络、服务协同）
-   ✅ 已配置 volume 挂载，代码修改自动生效（热重载）
-   ⚠️ 首次构建较慢；新增依赖需 `--build`

访问地址：

-   前端：http://localhost:5173
-   后端：http://localhost:8000
-   数据库：localhost:5432

### 方式 B ｜混合模式（前端本地，后端+DB 在 Docker）

```bash
# 终端 1：后端与数据库（Docker）
docker compose -f docker-compose.dev.yml up backend db

# 终端 2：前端（本地 Vite）
cd myblog-frontend-react
npm install
npm run dev
```

-   ✅ 前端开发体验最佳（Vite 热重载、调试方便）
-   ✅ 后端/数据库仍保持与生产一致
-   ⚠️ 需两个终端；确保前端请求的 API 指向 `http://localhost:8000`

前端 API 说明：项目已在 `vite.config.ts` 配置 `server.proxy`，默认把 `/api` 代理到 `VITE_BACKEND_HOST`（未设置则为 `http://localhost:8000`）。正常情况下无需改动即可访问后端。

### 方式 C ｜仅本地开发（如必须）

此模式下所有服务都本地运行，适用于无法使用 Docker 的场景。

```bash
# 1）加载环境变量（解决 admin 样式与 PostgreSQL 切换问题）
cd <项目根目录>
set -a
source .env.dev
set +a

# 2）启动后端
cd myblog-backend-django
source .venv/bin/activate
python manage.py runserver  # → http://127.0.0.1:8000

# 3）启动前端
cd ../myblog-frontend-react
npm install
npm run dev  # → http://localhost:5173
```

重要说明：

-   需要确保 `.env.dev` 中 `DEBUG=1`，否则开发服务器不会提供 admin 的静态文件（CSS/JS 会 404）。
-   设置 `POSTGRES_*` 变量即可让后端连接 Docker 中的 PostgreSQL（记得先启动 `db` 容器：`docker compose -f docker-compose.dev.yml up -d db`）。
-   如需免手动 source，可考虑使用 `direnv` 或在 `settings.py` 引入 `python-dotenv`（仅限本地开发）。

---

## 🐳 Docker 常用操作

```bash
# 启动（前台）
docker compose -f docker-compose.dev.yml up --build

# 启动（后台）
docker compose -f docker-compose.dev.yml up -d --build

# 查看运行状态
docker compose -f docker-compose.dev.yml ps

# 查看日志
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend

# 进入容器终端
docker compose -f docker-compose.dev.yml exec backend sh
docker compose -f docker-compose.dev.yml exec frontend sh

# 停止
docker compose -f docker-compose.dev.yml down

# 停止并删除数据卷（⚠️ 会丢失数据库数据）
docker compose -f docker-compose.dev.yml down -v
```

提示：新增依赖后需要重新构建镜像（`--build`），已配置的代码挂载支持热重载，无需为代码变更重启容器。

---

## 📝 日常工作流程

### 场景 1：前端 UI 开发（推荐：方式 B）

```bash
# 1. 切换到开发分支
git checkout dev/frontend

# 2. 启动后端与数据库（Docker）
docker compose -f docker-compose.dev.yml up -d backend db

# 3. 启动前端（本地 Vite）
cd myblog-frontend-react
npm install
npm run dev   # → http://localhost:5173

# 4. 开发与提交
# 编辑 src/pages/*、src/components/*，保存即热重载
git add src/
git commit -m "feat(ui): improve homepage hero section"
git push origin dev/frontend
```

---

### 场景 2：后端 API 开发（推荐：方式 A 或 B）

```bash
# 选项 1（方式 A）：完整 Docker，最接近生产
git checkout dev/backend
docker compose -f docker-compose.dev.yml up --build

# 选项 2（方式 B）：后端+DB 在 Docker，前端可本地或容器
git checkout dev/backend
docker compose -f docker-compose.dev.yml up -d backend db

# 修改后端代码并测试（容器内热重载已启用）
# blog/views.py, blog/models.py 等

# 如有模型变更，执行迁移（在容器内或本地虚拟环境均可）以下为在本地虚拟环境执行的代码
docker compose -f docker-compose.dev.yml exec backend python manage.py makemigrations
docker compose -f docker-compose.dev.yml exec backend python manage.py migrate

# 提交代码
git add myblog-backend-django/blog/
git commit -m "feat(api): add comment feature"
git push origin dev/backend
```

---

### 场景 3：提交前最终验证（使用 Docker）

```bash
# 1. 停止本地开发服务（Ctrl+C）

# 2. 用 Docker 完整测试
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build

# 3. 测试所有功能
# - 访问 http://localhost:5173
# - 测试前端各页面
# - 测试 API 调用
# - 检查数据库操作

# 4. 测试通过后合并
git checkout main
git merge dev/frontend
git push origin main

# 5. 清理 Docker 资源（可选）
docker compose -f docker-compose.dev.yml down
```

---

## 🔧 常用命令速查

### Git 操作

```bash
# 查看当前分支
git branch

# 查看状态
git status

# 暂存所有改动
git add .

# 提交
git commit -m "feat: your message"

# 推送到远程
git push origin <branch-name>

# 拉取最新代码
git pull origin main
```

### 后端操作

```bash
# 激活虚拟环境
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 数据库迁移
python manage.py makemigrations
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动开发服务
python manage.py runserver

# 收集静态文件（生产用）
python manage.py collectstatic
```

### 前端操作

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check

# 代码格式化（如果配置了）
npm run format
```

### Docker 操作

```bash
# 启动所有服务
docker compose -f docker-compose.dev.yml up

# 后台启动
docker compose -f docker-compose.dev.yml up -d

# 重新构建并启动
docker compose -f docker-compose.dev.yml up --build

# 停止服务
docker compose -f docker-compose.dev.yml down

# 查看运行状态
docker compose -f docker-compose.dev.yml ps

# 查看日志
docker compose -f docker-compose.dev.yml logs -f backend

# 进入容器终端
docker compose -f docker-compose.dev.yml exec backend sh
docker compose -f docker-compose.dev.yml exec frontend sh

# 清理所有资源（包括数据卷）
docker compose -f docker-compose.dev.yml down -v
```

---

## ❓ 常见问题

### Q0: 本地运行 `python manage.py runserver`，admin 样式丢失或仍然用 SQLite？

原因通常是没有加载根目录的 `.env.dev`：

```bash
# 在项目根目录加载环境变量（zsh）
set -a
source .env.dev
set +a

# 确保已启动 PostgreSQL 容器
docker compose -f docker-compose.dev.yml up -d db

# 再启动后端
cd myblog-backend-django
source .venv/bin/activate
python manage.py runserver
```

要点：`DEBUG=1` 才会在开发服务器下正确提供 admin 静态文件；设置 `POSTGRES_*` 环境变量后会切换到容器中的 PostgreSQL。

### Q1: 数据库迁移失败怎么办？

```bash
# 检查迁移状态
python manage.py showmigrations

# 回滚迁移
python manage.py migrate blog zero

# 重新迁移
python manage.py migrate

# 如果 SQLite 损坏，删除并重建
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Q2: Docker 容器启动失败？

```bash
# 查看详细日志
docker compose -f docker-compose.dev.yml logs backend
docker compose -f docker-compose.dev.yml logs frontend

# 检查端口占用
lsof -i :8000  # 后端端口
lsof -i :5173  # 前端端口
lsof -i :5432  # 数据库端口

# 清理并重启
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build
```

### Q3: 前端调用后端 API 失败（CORS 错误）？

**本地开发：**

-   确保 `.env.dev` 中 `CORS_ALLOW_ALL_ORIGINS=true`
-   或在 `settings.py` 的 `CORS_ALLOWED_ORIGINS` 中添加 `http://localhost:5173`

**Docker 开发：**

-   确保 `CORS_ALLOWED_ORIGINS` 包含 `http://frontend:5173`
-   检查 `vite.config.ts` 中的 proxy 配置

### Q4: 修改代码后没有生效？

**前端：**

-   检查浏览器控制台是否有错误
-   尝试硬刷新：`Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (macOS)
-   重启 Vite 开发服务

**后端：**

-   Django 开发服务器应该自动重载，检查终端是否有错误
-   如果修改了 `settings.py`，需要手动重启
-   Docker 模式需要重新构建：`docker compose -f docker-compose.dev.yml up --build`

### Q5: 如何切换数据库（SQLite ↔ PostgreSQL）？

**切换到 PostgreSQL：**

```bash
# 1. 启动 PostgreSQL 容器
docker compose -f docker-compose.dev.yml up -d db

# 2. 修改 .env.dev，取消注释 POSTGRES_* 变量

# 3. 迁移数据库
source .venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
```

**切换回 SQLite：**

```bash
# 1. 修改 .env.dev，注释掉 POSTGRES_* 变量

# 2. 使用默认 SQLite
python manage.py migrate
```

---

## 🎯 最佳实践

### 代码提交规范

使用语义化提交信息（Conventional Commits）：

```bash
# 格式
<type>(<scope>): <subject>

# 类型
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
perf:     性能优化
test:     测试相关
chore:    构建/工具配置

# 示例
feat(ui): add responsive navigation menu
fix(api): resolve CORS issue for Vercel frontend
docs: update development guide
refactor(components): extract Header component
```

### 开发前检查清单

-   [ ] 拉取最新代码：`git pull origin main`
-   [ ] 切换到正确分支：`git checkout dev/frontend`
-   [ ] 依赖是否最新：`npm install` / `pip install -r requirements.txt`
-   [ ] 数据库是否迁移：`python manage.py migrate`
-   [ ] 环境变量是否配置：检查 `.env.dev`

### 依赖管理规范

**后端（Python）：**

```bash
# 安装新依赖
pip install package-name

# ⚠️ 重要：立即更新 requirements.txt
pip freeze > requirements.txt

# 或手动添加到 requirements.txt（推荐，避免包含不必要的依赖）
echo "package-name==1.2.3" >> requirements.txt
```

**前端（Node.js）：**

```bash
# 生产依赖（运行时需要的包）
npm install package-name
# 示例：npm install axios, npm install react

# 开发依赖（仅开发时需要的包）
npm install --save-dev package-name  # 或简写：npm install -D package-name
# 示例：npm install -D typescript, npm install -D eslint

# ⚠️ package.json 和 package-lock.json 会自动更新，记得提交
git add package.json package-lock.json
```

**dependencies vs devDependencies 区别：**

| 类型              | 用途         | 示例                                | 生产环境  |
| ----------------- | ------------ | ----------------------------------- | --------- |
| `dependencies`    | 运行时需要   | react, axios, marked                | ✅ 需要   |
| `devDependencies` | 仅开发时需要 | typescript, vite, eslint, @types/\* | ❌ 不需要 |

**实际影响：**

-   生产构建时运行 `npm install --production` 只会安装 `dependencies`
-   Docker 生产镜像更小、依赖更少、更安全
-   Vercel 等平台部署时会自动区分

**为什么这很重要？**

-   ✅ 团队成员运行 `pip install -r requirements.txt` 时能安装相同版本
-   ✅ Docker 构建时能正确安装依赖
-   ✅ 避免"在我机器上能运行"的问题
-   ✅ 确保生产环境与开发环境一致

### 提交前检查清单

-   [ ] 代码格式正确（无明显错误）
-   [ ] 本地测试通过
-   [ ] 如有数据库变更，包含迁移文件
-   [ ] **如有新依赖，已更新 `requirements.txt` 或 `package.json`**
-   [ ] 提交信息清晰
-   [ ] Docker 环境验证通过（重要功能）

---

## 📚 相关文档

-   [README.md](README.md) - 项目概述与快速开始
-   [README.zh-CN.md](README.zh-CN.md) - 中文版说明文档
-   [myblog-frontend-react/VERCEL_DEPLOYMENT.md](myblog-frontend-react/VERCEL_DEPLOYMENT.md) - Vercel 部署指南
-   [deploy/manage_prod.sh](deploy/manage_prod.sh) - 生产环境管理脚本

---

## � 快速部署（生产环境）

项目提供了自动化部署脚本，位于 `scripts/` 目录：

| 脚本              | 用途                                    | 运行时间 |
| ----------------- | --------------------------------------- | -------- |
| `setup-server.sh` | 服务器初始化（安装 Docker、配置防火墙） | ~3 分钟  |
| `deploy.sh`       | 构建镜像并启动服务                      | ~5 分钟  |
| `setup-ssl.sh`    | 申请 SSL 证书并配置 HTTPS               | ~2 分钟  |
| `backup.sh`       | 数据库备份                              | ~10 秒   |
| `test-api.sh`     | API 接口测试                            | ~5 秒    |

### 快速部署步骤

#### 1. SSH 连接服务器并初始化

```bash
ssh root@your-server-ip

# 克隆项目
git clone https://github.com/wanglovesym/myblog-py-django-ts-react.git /root/myblog
cd /root/myblog

# 运行初始化脚本
chmod +x scripts/*.sh
./scripts/setup-server.sh
```

#### 2. 配置环境变量

```bash
cp .env.prod.example .env.prod
vim .env.prod
```

**必须修改的配置：**

```bash
# 生成安全的 SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(50))"

# 设置数据库密码
POSTGRES_PASSWORD=你的安全密码
```

#### 3. 运行部署

```bash
./scripts/deploy.sh
```

#### 4. 配置 SSL（DNS 生效后）

```bash
./scripts/setup-ssl.sh
```

#### 5. 创建管理员

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### 部署脚本执行顺序

```
┌─────────────────────────────────────────────────────────┐
│  1. setup-server.sh                                     │
│     └── 安装 Docker、配置防火墙、优化系统               │
│                         ↓                               │
│  2. 配置 .env.prod（手动）                                 │
│     └── 设置密码、密钥和 VITE_API_BASE_URL               │
│                         ↓                               │
│  3. deploy.sh                                           │
│     └── 构建镜像、启动容器、运行迁移                    │
│                         ↓                               │
│  4. setup-ssl.sh（DNS 生效后）                          │
│     └── 申请证书、配置 HTTPS、设置自动续期              │
└─────────────────────────────────────────────────────────┘
```

---

## �💡 推荐开发工具

### VS Code 插件

-   **Python** - Python 语言支持
-   **Pylance** - Python 类型检查与智能提示
-   **ES7+ React/Redux/React-Native snippets** - React 代码片段
-   **Tailwind CSS IntelliSense** - Tailwind 自动补全
-   **ESLint** - JavaScript/TypeScript 代码检查
-   **Prettier** - 代码格式化
-   **Docker** - Docker 文件支持
-   **GitLens** - Git 增强工具

### 浏览器插件

-   **React Developer Tools** - React 组件调试
-   **Redux DevTools** - 状态管理调试（如使用 Redux）
-   **JSON Formatter** - API 响应格式化

---

**Happy Coding! 🚀**
