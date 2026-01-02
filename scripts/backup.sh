#!/bin/bash
# ========================================
# MyBlog - 数据库备份脚本
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

# 配置
BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP_DAYS="${KEEP_DAYS:-30}"
DATE=$(date +%Y%m%d_%H%M%S)

echo ""
echo "========================================"
echo "  MyBlog - 数据库备份"
echo "========================================"
echo ""

# 检查是否在项目目录
if [ ! -f "docker-compose.prod.yml" ] && [ ! -f "docker-compose.dev.yml" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

# 创建备份目录
mkdir -p "$BACKUP_DIR/postgres"

# 确定使用哪个 docker-compose 文件
if [ -f "docker-compose.prod.yml" ] && docker compose -f docker-compose.prod.yml ps --quiet db 2>/dev/null | grep -q .; then
    COMPOSE_FILE="docker-compose.prod.yml"
    DB_CONTAINER="myblog-db-prod"
else
    COMPOSE_FILE="docker-compose.dev.yml"
    DB_CONTAINER="myblog-db"
fi

log_info "使用配置: $COMPOSE_FILE"
log_info "数据库容器: $DB_CONTAINER"

# 检查数据库容器是否运行
if ! docker ps --format '{{.Names}}' | grep -q "$DB_CONTAINER"; then
    log_error "数据库容器 $DB_CONTAINER 未运行"
    exit 1
fi

# 执行备份
BACKUP_FILE="$BACKUP_DIR/postgres/myblog_db_$DATE.sql.gz"
log_info "开始备份数据库..."

docker exec $DB_CONTAINER pg_dump -U myblog myblog | gzip > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
    log_success "数据库备份完成: $BACKUP_FILE ($BACKUP_SIZE)"
else
    log_error "备份失败"
    exit 1
fi

# 清理旧备份
log_info "清理 $KEEP_DAYS 天前的备份..."
find "$BACKUP_DIR/postgres" -name "*.sql.gz" -mtime +$KEEP_DAYS -delete

# 显示备份列表
echo ""
log_info "当前备份列表:"
ls -lh "$BACKUP_DIR/postgres/" | tail -10

echo ""
log_success "备份完成！"
echo ""
