# ============================================================
# Makefile for MyBlog Project
# 使用: make help 查看所有可用命令
# ============================================================

.PHONY: help dev-up dev-up-d dev-down dev-logs prod-up prod-down prod-logs \
        shell migrate superuser clean status init restart-logs

# 默认目标：显示帮助信息
.DEFAULT_GOAL := help

# ============================================================
# 帮助信息
# ============================================================
help:
	@echo "=============================================="
	@echo "  MyBlog Project - Docker 快速命令"
	@echo "=============================================="
	@echo ""
	@echo "📦 开发环境 (Development):"
	@echo "  make dev-up             - 启动开发环境（前台运行）"
	@echo "  make dev-up-d           - 在后台启动开发环境"
	@echo "  make dev-down           - 停止开发环境"
	@echo "  make dev-restart        - 重启开发环境（不重新构建）"
	@echo "  make dev-rebuild        - 重新构建并启动（安装新依赖）"
	@echo "  make dev-rebuild-backend  - 只重新构建后端容器"
	@echo "  make dev-rebuild-frontend - 只重新构建前端容器"
	@echo "  make dev-logs           - 查看开发环境日志"
	@echo "  make dev-logs-backend   - 只查看后端日志"
	@echo "  make dev-logs-frontend  - 只查看前端日志"
	@echo ""
	@echo "🚀 生产环境 (Production):"
	@echo "  make prod-up            - 启动生产环境"
	@echo "  make prod-down          - 停止生产环境"
	@echo "  make prod-restart       - 重启生产环境"
	@echo "  make prod-rebuild       - 重新构建并启动所有服务"
	@echo "  make prod-rebuild-backend  - 只重新构建后端容器"
	@echo "  make prod-rebuild-frontend - 只重新构建前端容器"
	@echo "  make prod-logs          - 查看生产环境日志"
	@echo "  make prod-shell         - 进入生产后端容器 shell"
	@echo ""
	@echo "🐚 Shell 访问:"
	@echo "  make shell              - 进入开发后端容器 shell"
	@echo "  make shell-frontend     - 进入开发前端容器 shell"
	@echo "  make shell-db           - 进入数据库容器 psql"
	@echo ""
	@echo "🗄️  数据库管理 (Database):"
	@echo "  make makemigrations     - 生成迁移文件"
	@echo "  make migrate            - 执行数据库迁移"
	@echo "  make model-update       - 生成迁移并重启（修改模型后使用）"
	@echo "  make superuser          - 创建超级用户（交互式）"
	@echo "  make collectstatic      - 收集静态文件"
	@echo ""
	@echo "💾 数据导入导出 (Data):"
	@echo "  make export-blog        - 导出博客数据到 blog_data.json"
	@echo "  make export-project     - 导出项目数据到 project_data.json"
	@echo "  make export-all         - 导出所有数据到 data.json"
	@echo "  make import-data        - 从 data.json 导入数据"
	@echo ""
	@echo "🧹 清理 (Cleanup):"
	@echo "  make clean              - 停止并删除所有容器和卷"
	@echo "  make clean-images       - 删除所有容器、卷和镜像"
	@echo "  make prune              - 清理未使用的 Docker 资源"
	@echo ""
	@echo "📊 状态 (Status):"
	@echo "  make status             - 显示容器状态"
	@echo "  make ps                 - 显示容器状态（简写）"
	@echo ""
	@echo "⚡ 快捷命令 (Quick):"
	@echo "  make init               - 首次初始化（启动 + 迁移）"
	@echo "  make restart-logs       - 重启并查看日志"
	@echo ""

# ============================================================
# 开发环境命令
# ============================================================

dev-up:
	docker compose -f docker-compose.dev.yml up

dev-up-d:
	docker compose -f docker-compose.dev.yml up -d
	@echo ""
	@echo "✅ 开发环境已在后台启动"
	@echo ""
	@echo "📍 访问地址:"
	@echo "   前端: http://localhost:5173"
	@echo "   后端: http://localhost:8000"
	@echo "   管理: http://localhost:8000/admin"
	@echo "   API:  http://localhost:8000/api"
	@echo ""

dev-down:
	docker compose -f docker-compose.dev.yml down
	@echo "✅ 开发环境已停止"

dev-restart:
	docker compose -f docker-compose.dev.yml restart
	@echo "✅ 开发环境已重启"

dev-rebuild:
	docker compose -f docker-compose.dev.yml up --build -d
	@echo "✅ 开发环境已重新构建并启动"

dev-rebuild-backend:
	docker compose -f docker-compose.dev.yml up --build -d backend
	@echo "✅ 后端容器已重新构建并启动"

dev-rebuild-frontend:
	docker compose -f docker-compose.dev.yml up --build -d frontend
	@echo "✅ 前端容器已重新构建并启动"

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-logs-backend:
	docker compose -f docker-compose.dev.yml logs -f backend

dev-logs-frontend:
	docker compose -f docker-compose.dev.yml logs -f frontend

# ============================================================
# 生产环境命令
# ============================================================

prod-up:
	docker compose -f docker-compose.prod.yml up -d
	@echo ""
	@echo "✅ 生产环境已启动"
	@echo ""
	@echo "📍 访问地址:"
	@echo "   网站: https://www.wangshixin.me"
	@echo "   API:  https://api.wangshixin.me"
	@echo ""

prod-down:
	docker compose -f docker-compose.prod.yml down
	@echo "✅ 生产环境已停止"

prod-restart:
	docker compose -f docker-compose.prod.yml restart
	@echo "✅ 生产环境已重启"

prod-rebuild:
	docker compose -f docker-compose.prod.yml build backend frontend
	docker compose -f docker-compose.prod.yml up -d backend frontend
	docker compose -f docker-compose.prod.yml restart proxy
	@echo "✅ 生产环境已重新构建并启动，nginx 已重启"

prod-rebuild-backend:
	docker compose -f docker-compose.prod.yml build backend
	docker compose -f docker-compose.prod.yml up -d backend
	docker compose -f docker-compose.prod.yml restart proxy
	@echo "✅ 后端容器已重新构建并启动，nginx 已重启"

prod-rebuild-frontend:
	docker compose -f docker-compose.prod.yml build frontend
	docker compose -f docker-compose.prod.yml up -d frontend
	docker compose -f docker-compose.prod.yml restart proxy
	@echo "✅ 前端容器已重新构建并启动，nginx 已重启"

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-logs-backend:
	docker compose -f docker-compose.prod.yml logs -f backend

prod-logs-frontend:
	docker compose -f docker-compose.prod.yml logs -f frontend

prod-logs-proxy:
	docker compose -f docker-compose.prod.yml logs -f proxy

prod-shell:
	docker compose -f docker-compose.prod.yml exec backend /bin/sh

# ============================================================
# Shell 访问
# ============================================================

shell:
	docker compose -f docker-compose.dev.yml exec backend /bin/sh

shell-frontend:
	docker compose -f docker-compose.dev.yml exec frontend /bin/sh

shell-db:
	docker compose -f docker-compose.dev.yml exec db psql -U myblog -d myblog

# ============================================================
# 数据库管理
# ============================================================

makemigrations:
	docker compose -f docker-compose.dev.yml exec backend python manage.py makemigrations
	@echo "✅ 迁移文件已生成"

migrate:
	docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
	@echo "✅ 数据库迁移完成"

model-update:
	@echo "🔄 生成迁移文件..."
	docker compose -f docker-compose.dev.yml exec backend python manage.py makemigrations
	@echo "🔄 执行迁移..."
	docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
	@echo ""
	@echo "✅ 模型更新完成！"
	@echo ""
	@echo "📝 请记得提交迁移文件到 Git："
	@echo "   git add myblog-backend-django/*/migrations/"
	@echo "   git commit -m 'feat: update database models'"

superuser:
	docker compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser

collectstatic:
	docker compose -f docker-compose.dev.yml exec backend python manage.py collectstatic --noinput
	@echo "✅ 静态文件已收集"

# ============================================================
# 数据导入导出
# ============================================================

export-blog:
	@echo "📤 导出博客数据..."
	docker compose -f docker-compose.dev.yml exec backend python manage.py dumpdata blog --indent 2 > blog_data.json
	@echo "✅ 博客数据已导出到 blog_data.json"
	@ls -lh blog_data.json

export-project:
	@echo "📤 导出项目数据..."
	docker compose -f docker-compose.dev.yml exec backend python manage.py dumpdata project --indent 2 > project_data.json
	@echo "✅ 项目数据已导出到 project_data.json"
	@ls -lh project_data.json

export-all:
	@echo "📤 导出所有数据..."
	docker compose -f docker-compose.dev.yml exec backend python manage.py dumpdata --indent 2 > data.json
	@echo "✅ 所有数据已导出到 data.json"
	@ls -lh data.json

import-data:
	@if [ ! -f "data.json" ]; then \
		echo "❌ 错误: 找不到 data.json 文件"; \
		exit 1; \
	fi
	@echo "📥 导入数据..."
	docker compose -f docker-compose.dev.yml exec -T backend python manage.py loaddata data.json
	@echo "✅ 数据导入完成"

import-blog:
	@if [ ! -f "blog_data.json" ]; then \
		echo "❌ 错误: 找不到 blog_data.json 文件"; \
		exit 1; \
	fi
	@echo "📥 导入博客数据..."
	docker compose -f docker-compose.dev.yml exec -T backend python manage.py loaddata blog_data.json
	@echo "✅ 博客数据导入完成"

import-project:
	@if [ ! -f "project_data.json" ]; then \
		echo "❌ 错误: 找不到 project_data.json 文件"; \
		exit 1; \
	fi
	@echo "📥 导入项目数据..."
	docker compose -f docker-compose.dev.yml exec -T backend python manage.py loaddata project_data.json
	@echo "✅ 项目数据导入完成"

# ============================================================
# 清理命令
# ============================================================

clean:
	docker compose -f docker-compose.dev.yml down -v
	@echo "✅ 开发环境容器和卷已删除"

clean-prod:
	docker compose -f docker-compose.prod.yml down -v
	@echo "✅ 生产环境容器和卷已删除"

clean-images:
	docker compose -f docker-compose.dev.yml down -v --rmi all
	@echo "✅ 开发环境容器、卷和镜像已删除"

clean-images-prod:
	docker compose -f docker-compose.prod.yml down -v --rmi all
	@echo "✅ 生产环境容器、卷和镜像已删除"

prune:
	docker system prune -f
	@echo "✅ 未使用的 Docker 资源已清理"

# ============================================================
# 状态查看
# ============================================================

status:
	@echo "📦 开发环境容器状态:"
	@docker compose -f docker-compose.dev.yml ps
	@echo ""
	@echo "🚀 生产环境容器状态:"
	@docker compose -f docker-compose.prod.yml ps

ps:
	docker compose -f docker-compose.dev.yml ps

ps-prod:
	docker compose -f docker-compose.prod.yml ps

# ============================================================
# 构建命令
# ============================================================

build:
	docker compose -f docker-compose.dev.yml build
	@echo "✅ 开发环境镜像已构建"

build-prod:
	docker compose -f docker-compose.prod.yml build
	@echo "✅ 生产环境镜像已构建"

# ============================================================
# 快捷组合命令
# ============================================================

# 首次初始化开发环境
init: dev-up-d migrate
	@echo ""
	@echo "🎉 开发环境初始化完成！"
	@echo ""
	@echo "📝 下一步："
	@echo "   1. 创建管理员账号: make superuser"
	@echo "   2. 访问管理后台: http://localhost:8000/admin"
	@echo "   3. 创建文章和项目"
	@echo ""

# 快速重启并查看日志
restart-logs: dev-restart dev-logs
