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
BASE_DOMAIN="${BASE_DOMAIN:-wangshixin.me}"
EMAIL="${EMAIL:-admin@wangshixin.me}"

# 所有需要证书的域名
DOMAINS=("$BASE_DOMAIN" "www.$BASE_DOMAIN" "api.$BASE_DOMAIN")

echo ""
echo "========================================"
echo "  Let's Encrypt SSL 证书配置"
echo "========================================"
echo ""
echo "  域名: ${DOMAINS[*]}"
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
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com)

for DOMAIN in "${DOMAINS[@]}"; do
    RESOLVED_IP=$(dig +short $DOMAIN @8.8.8.8 | head -1)
    
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
done

# 安装 certbot
if ! command -v certbot &> /dev/null; then
    log_info "安装 Certbot..."
    apt-get update
    apt-get install -y certbot
fi

# 停止 proxy 容器以释放 80 端口
log_info "临时停止 Nginx Proxy..."
docker stop myblog-proxy 2>/dev/null || true

# 构建 certbot 域名参数
DOMAIN_ARGS=""
for DOMAIN in "${DOMAINS[@]}"; do
    DOMAIN_ARGS="$DOMAIN_ARGS -d $DOMAIN"
done

# 申请证书（包含所有域名）
log_info "申请 SSL 证书..."
certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --expand \
    $DOMAIN_ARGS

# 复制证书到项目目录（使用 nginx 配置期望的文件名）
log_info "复制证书到项目目录..."
mkdir -p nginx/ssl

# 证书保存在第一个域名的目录下
CERT_DIR="/etc/letsencrypt/live/$BASE_DOMAIN"

# 如果目录不存在，尝试查找其他可能的目录
if [ ! -d "$CERT_DIR" ]; then
    CERT_DIR=$(find /etc/letsencrypt/live -maxdepth 1 -type d -name "*$BASE_DOMAIN*" | head -1)
fi

if [ -z "$CERT_DIR" ] || [ ! -d "$CERT_DIR" ]; then
    log_error "找不到证书目录"
    exit 1
fi

log_info "证书目录: $CERT_DIR"

# 复制并重命名证书文件以匹配 nginx 配置
# 主域名证书 (wangshixin.me 和 www.wangshixin.me 使用)
cp "$CERT_DIR/fullchain.pem" nginx/ssl/${BASE_DOMAIN}.crt
cp "$CERT_DIR/privkey.pem" nginx/ssl/${BASE_DOMAIN}.key

# API 子域名证书 (使用同一证书，因为是 SAN 证书)
cp "$CERT_DIR/fullchain.pem" nginx/ssl/api.${BASE_DOMAIN}.crt
cp "$CERT_DIR/privkey.pem" nginx/ssl/api.${BASE_DOMAIN}.key

# 同时保留原始文件名（方便调试）
cp "$CERT_DIR/fullchain.pem" nginx/ssl/fullchain.pem
cp "$CERT_DIR/privkey.pem" nginx/ssl/privkey.pem

chmod 644 nginx/ssl/*.pem nginx/ssl/*.crt nginx/ssl/*.key

# 更新 nginx 配置使用生产配置（带 SSL）
log_info "更新 Nginx 配置..."
cp nginx/conf.d/production.conf.ssl nginx/conf.d/default.conf

# 重启服务
log_info "重启服务..."
docker compose -f docker-compose.prod.yml up -d

# 设置自动续期
log_info "配置证书自动续期..."
cat > /etc/cron.d/certbot-myblog << CRON
# 每天凌晨2点检查证书续期
0 2 * * * root certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/$BASE_DOMAIN/fullchain.pem /root/myblog/nginx/ssl/${BASE_DOMAIN}.crt && cp /etc/letsencrypt/live/$BASE_DOMAIN/privkey.pem /root/myblog/nginx/ssl/${BASE_DOMAIN}.key && cp /etc/letsencrypt/live/$BASE_DOMAIN/fullchain.pem /root/myblog/nginx/ssl/api.${BASE_DOMAIN}.crt && cp /etc/letsencrypt/live/$BASE_DOMAIN/privkey.pem /root/myblog/nginx/ssl/api.${BASE_DOMAIN}.key && docker restart myblog-proxy"
CRON

chmod 644 /etc/cron.d/certbot-myblog

echo ""
log_success "SSL 证书配置完成！"
echo ""
echo "========================================"
echo "  证书信息"
echo "========================================"
echo ""
echo "  证书位置: nginx/ssl/"
echo "  包含域名: ${DOMAINS[*]}"
echo "  有效期: 90天（已配置自动续期）"
echo ""
echo "  网站地址:"
echo "    - https://www.$BASE_DOMAIN"
echo "    - https://api.$BASE_DOMAIN"
echo ""
echo "========================================"
echo ""
