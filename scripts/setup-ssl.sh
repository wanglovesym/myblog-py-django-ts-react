#!/bin/bash
# ========================================
# MyBlog - Let's Encrypt SSL 证书配置
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

# 配置 - 修改为你的域名和邮箱
DOMAIN="${DOMAIN:-api.wangshixin.me}"
EMAIL="${EMAIL:-admin@wangshixin.me}"

echo ""
echo "========================================"
echo "  Let's Encrypt SSL 证书配置"
echo "========================================"
echo ""
echo "  域名: $DOMAIN"
echo "  邮箱: $EMAIL"
echo ""

# 检查是否在项目目录
if [ ! -f "docker-compose.prod.yml" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

# 安装 dig 工具（如果不存在）
if ! command -v dig &> /dev/null; then
    log_info "安装 dnsutils..."
    apt-get update
    apt-get install -y dnsutils
fi

# 检查域名是否已解析
log_info "检查域名解析..."
RESOLVED_IP=$(dig +short $DOMAIN @8.8.8.8 | head -1)
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com)

if [ -z "$RESOLVED_IP" ]; then
    log_error "无法解析域名 $DOMAIN"
    log_info "请确保 DNS 已配置并生效"
    exit 1
fi

if [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
    log_warning "域名 $DOMAIN 解析到: $RESOLVED_IP"
    log_warning "当前服务器 IP: $SERVER_IP"
    log_warning "请确保域名已正确解析到此服务器"
    read -p "是否继续？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    log_success "域名解析正确: $DOMAIN -> $SERVER_IP"
fi

# 安装 certbot
if ! command -v certbot &> /dev/null; then
    log_info "安装 Certbot..."
    apt-get update
    apt-get install -y certbot
fi

# 停止 proxy 容器以释放 80 端口
log_info "临时停止 Nginx Proxy..."
docker stop myblog-proxy 2>/dev/null || true

# 申请证书
log_info "申请 SSL 证书..."
certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    -d $DOMAIN

# 创建证书目录
mkdir -p /etc/letsencrypt

# 重启服务
log_info "重启服务..."
docker compose -f docker-compose.prod.yml up -d

# 设置自动续期
log_info "配置证书自动续期..."
cat > /etc/cron.d/certbot-myblog << EOF
# 每天凌晨2点检查证书续期
0 2 * * * root certbot renew --quiet --post-hook "docker restart myblog-proxy"
EOF

chmod 644 /etc/cron.d/certbot-myblog

echo ""
log_success "SSL 证书配置完成！"
echo ""
echo "========================================"
echo "  证书信息"
echo "========================================"
echo ""
echo "  证书位置: /etc/letsencrypt/live/$DOMAIN/"
echo "  有效期: 90天（已配置自动续期）"
echo ""
echo "  网站地址: https://$DOMAIN"
echo ""
echo "========================================"
echo ""
