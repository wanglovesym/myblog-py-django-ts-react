#!/bin/bash
# ========================================
# MyBlog - 服务器初始化脚本
# 在新的服务器上运行此脚本
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

echo ""
echo "========================================"
echo "  MyBlog - 服务器初始化"
echo "========================================"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    log_error "请使用 root 用户运行此脚本"
    exit 1
fi

# 更新系统
log_info "更新系统包..."
apt-get update && apt-get upgrade -y

# 安装必要工具
log_info "安装必要工具..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    vim \
    htop \
    ufw

# 安装 Docker
if ! command -v docker &> /dev/null; then
    log_info "安装 Docker..."
    
    # 检测是否在中国内地（根据时区或语言环境判断）
    if [ -f /etc/timezone ] && grep -q "Asia/Shanghai" /etc/timezone; then
        log_info "检测到中国内地服务器，使用阿里云镜像源..."
        # 添加阿里云 Docker GPG 密钥
        curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        # 添加阿里云 Docker 仓库
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    else
        log_info "使用官方 Docker 源..."
        # 添加官方 Docker GPG 密钥
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        # 添加官方 Docker 仓库
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    fi
    
    # 更新并安装 Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # 启动 Docker
    systemctl start docker
    systemctl enable docker
    
    log_success "Docker 安装完成"
else
    log_info "Docker 已安装: $(docker --version)"
fi

# 验证 Docker Compose
if docker compose version &> /dev/null; then
    log_info "Docker Compose 插件已可用: $(docker compose version)"
else
    log_error "Docker Compose 插件未安装"
    exit 1
fi

# 配置防火墙
log_info "配置防火墙..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
log_success "防火墙配置完成"

# 创建项目目录
PROJECT_DIR="/root/myblog"
log_info "创建项目目录: $PROJECT_DIR"
mkdir -p $PROJECT_DIR

# 配置系统参数（优化性能）
log_info "优化系统参数..."
cat >> /etc/sysctl.conf << 'EOF'

# Docker 和网络优化
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 30
vm.swappiness = 10
EOF

sysctl -p 2>/dev/null || true

# 配置 Docker 日志轮转
log_info "配置 Docker 日志轮转..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker

echo ""
log_success "服务器初始化完成！"
echo ""
echo "========================================"
echo "  下一步"
echo "========================================"
echo ""
echo "  1. 克隆项目代码:"
echo "     cd $PROJECT_DIR"
echo "     git clone https://github.com/wanglovesym/myblog-py-django-ts-react.git ."
echo ""
echo "  2. 配置环境变量:"
echo "     cp .env.prod.django.example .env.prod.django"
echo "     vim .env.prod.django"
echo ""
echo "  3. 运行部署脚本:"
echo "     ./scripts/deploy.sh"
echo ""
echo "========================================"
echo ""
