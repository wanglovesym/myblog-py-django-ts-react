# 开发指南 (Development Guide)

本文档说明项目的开发流程、环境配置与最佳实践。

---

## 📋 目录

-   [分支管理策略](#分支管理策略)
-   [开发环境选择](#开发环境选择)
-   [本地开发流程](#本地开发流程)
-   [Docker 开发流程](#docker-开发流程)
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

## 🚀 开发环境选择

根据不同场景选择合适的开发方式：

| 开发方式        | 适用场景               | 优点                       | 缺点               |
| --------------- | ---------------------- | -------------------------- | ------------------ |
| **纯本地开发**  | 日常 UI 开发、快速调试 | 启动快（秒级）、热重载即时 | 环境与生产略有差异 |
| **混合模式**    | 大多数开发场景         | 平衡速度与环境一致性       | 需要管理多个进程   |
| **完整 Docker** | 环境验证、集成测试     | 与生产环境一致             | 启动慢（分钟级）   |

---

## 💻 本地开发流程

### 方式一：纯本地开发（推荐日常使用）

**适用场景：** 前端美化、组件开发、快速原型

**启动步骤：**

```bash
# 终端 1：启动后端
cd myblog-backend-django
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python manage.py runserver
# → http://127.0.0.1:8000

# 终端 2：启动前端
cd myblog-frontend-react
npm run dev
# → http://localhost:5173
```

**优点：**

-   ✅ 启动速度极快（秒级）
-   ✅ Vite 热重载即时响应
-   ✅ 直接使用 VS Code 调试
-   ✅ 资源占用低

**缺点：**

-   ❌ 使用 SQLite 而非 PostgreSQL
-   ❌ 环境与生产略有差异

---

### 方式二：混合模式（推荐大多数场景）

**适用场景：** 需要 PostgreSQL、更接近生产环境

**启动步骤：**

```bash
# 终端 1：启动数据库（Docker）
docker compose -f docker-compose.dev.yml up db
# 或后台运行：docker compose -f docker-compose.dev.yml up -d db

# 终端 2：启动后端（本地，连接 Docker 数据库）
cd myblog-backend-django
source .venv/bin/activate
# 确保 .env.dev.django 中配置了 PostgreSQL
python manage.py runserver
# → http://127.0.0.1:8000

# 终端 3：启动前端（本地）
cd myblog-frontend-react
npm run dev
# → http://localhost:5173
```

**优点：**

-   ✅ 数据库环境与生产一致（PostgreSQL）
-   ✅ 代码热重载快速
-   ✅ 灵活调试
-   ✅ 数据持久化（容器重启不丢数据）

**缺点：**

-   ⚠️ 需要管理多个终端窗口

---

## 🐳 Docker 开发流程

### 完整 Docker 环境

**适用场景：** 环境验证、集成测试、提交前最终检查

**启动步骤：**

```bash
# 构建并启动所有服务
docker compose -f docker-compose.dev.yml up --build

# 或后台运行
docker compose -f docker-compose.dev.yml up -d --build

# 查看日志
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend

# 停止服务
docker compose -f docker-compose.dev.yml down

# 停止并删除数据卷（⚠️ 会丢失数据库数据）
docker compose -f docker-compose.dev.yml down -v
```

**服务访问地址：**

-   前端：http://localhost:5173
-   后端：http://localhost:8000
-   数据库：localhost:5432

**优点：**

-   ✅ 与生产环境高度一致
-   ✅ 一键启动所有服务
-   ✅ 环境隔离，不污染本机
-   ✅ 代码热重载（已配置 volume 挂载，修改代码自动生效）

**缺点：**

-   ❌ 启动慢（首次构建需数分钟）
-   ❌ 添加依赖后需要重新构建镜像（`npm install` / `pip install` 后需 `--build`）
-   ❌ 资源占用较高（多个容器同时运行）

---

## 📝 日常工作流程

### 场景 1：前端 UI 开发（推荐方式一）

```bash
# 1. 切换到开发分支
git checkout dev/frontend

# 2. 启动前端开发服务
cd myblog-frontend-react
npm run dev

# 3. 编辑代码（VS Code）
# src/pages/Home.tsx
# src/components/Header.tsx
# ...保存后浏览器自动刷新

# 4. 阶段性提交
git add src/
git commit -m "feat(ui): improve homepage hero section"
git push origin dev/frontend
```

---

### 场景 2：后端 API 开发（推荐方式二）

```bash
# 1. 启动数据库
docker compose -f docker-compose.dev.yml up -d db

# 2. 切换到开发分支
git checkout dev/backend

# 3. 启动后端
cd myblog-backend-django
source .venv/bin/activate
python manage.py runserver

# 4. 修改代码并测试
# blog/views.py
# blog/models.py
# 保存后 Django 自动重载

# 5. 数据库迁移（如有 model 变更）
python manage.py makemigrations
python manage.py migrate

# 6. 提交代码
git add blog/
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

-   确保 `.env.dev.django` 中 `CORS_ALLOW_ALL_ORIGINS=true`
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

# 2. 修改 .env.dev.django，取消注释 POSTGRES_* 变量

# 3. 迁移数据库
source .venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
```

**切换回 SQLite：**

```bash
# 1. 修改 .env.dev.django，注释掉 POSTGRES_* 变量

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
-   [ ] 环境变量是否配置：检查 `.env.dev.django`

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

## 💡 推荐开发工具

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
