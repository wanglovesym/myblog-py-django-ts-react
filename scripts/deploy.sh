#!/bin/bash
# ========================================
# MyBlog - 生产环境部署脚本
# ========================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 项目配置
DOMAIN="${DOMAIN:-wangshixin.me}"
API_DOMAIN="${API_DOMAIN:-api.wangshixin.me}"

echo ""
echo "========================================"
echo "  MyBlog - 生产环境部署"
echo "========================================"
echo ""

# 检查是否在项目目录
if [ ! -f "docker-compose.prod.yml" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

# 检查环境变量文件
if [ ! -f ".env.prod.django" ]; then
    log_error "未找到 .env.prod.django 文件"
    log_info "请先复制并修改: cp .env.prod.django.example .env.prod.django"
    exit 1
fi

# 加载环境变量
set -a
source .env.prod.django
set +a

# 验证必要的环境变量
if [ -z "$SECRET_KEY" ] || [ "$SECRET_KEY" = "your-production-secret-key-change-this" ]; then
    log_error "请修改 SECRET_KEY 为一个安全的随机值"
    log_info "生成方法: python3 -c \"import secrets; print(secrets.token_urlsafe(50))\""
    exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "your-secure-postgres-password" ]; then
    log_error "请修改 POSTGRES_PASSWORD 为一个安全的密码"
    exit 1
fi

# 创建必要的目录
log_info "创建必要的目录..."
mkdir -p deploy/ssl

# 获取 Git 版本信息
if command -v git &> /dev/null && [ -d ".git" ]; then
    APP_VERSION=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
else
    APP_VERSION="unknown"
fi
log_info "当前版本: $APP_VERSION"

# 构建镜像
log_info "构建 Docker 镜像..."
docker compose -f docker-compose.prod.yml build --build-arg APP_VERSION="$APP_VERSION"

# 停止旧容器（如果存在）
log_info "停止旧容器..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# 启动服务
log_info "启动服务..."
docker compose -f docker-compose.prod.yml up -d

# 等待服务启动
log_info "等待服务启动..."
sleep 15

# 运行数据库迁移
log_info "运行数据库迁移..."
docker compose -f docker-compose.prod.yml exec -T backend python manage.py migrate --noinput

# 收集静态文件
log_info "收集静态文件..."
docker compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput

# 检查服务状态
log_info "检查服务状态..."
docker compose -f docker-compose.prod.yml ps

# 健康检查
log_info "进行健康检查..."
sleep 5

# 检查后端健康状态
if curl -fsS -o /dev/null "http://localhost:8000/api/health/" 2>/dev/null; then
    log_success "后端服务健康检查通过"
else
    log_warning "后端服务健康检查失败，请检查日志"
fi

echo ""
log_success "部署完成！"
echo ""
echo "========================================"
echo "  访问地址"
echo "========================================"
echo ""
echo "  HTTP:  http://${DOMAIN}:8080"
echo "  HTTPS: https://${DOMAIN}:8443 (需要先配置 SSL)"
echo ""
echo "  API:   https://${API_DOMAIN}:8443/api/"
echo "  Admin: https://${API_DOMAIN}:8443/admin/"
echo ""
echo "========================================"
echo ""
echo "📝 下一步："
echo "   1. 配置 SSL 证书: ./scripts/setup-ssl.sh"
echo "   2. 创建管理员: docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser"
echo ""
