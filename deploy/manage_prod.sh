#!/usr/bin/env bash
###############################################################################
# 一键生产环境管理脚本 (deploy/manage_prod.sh)
# ----------------------------------------------------------------------------
# 目标读者：零基础 / 新手同学。脚本用极其详细的中文注释解释每一步。
# 功能概览：
#   1. 代码与配置文件同步到远程服务器 (scp)
#   2. 构建或重新构建后端 / 前端镜像 (docker compose build)
#   3. 启动或更新容器 (docker compose up -d)
#   4. 查看服务状态 / 日志 (status / logs)
#   5. 证书续期 (renew / renew-dry-run)
#   6. Nginx / Backend / Frontend 单服务重启 (restart <service>)
# 用法：
#   ./deploy/manage_prod.sh <子命令> [可选参数]
# 例如：
#   ./deploy/manage_prod.sh help
#   ./deploy/manage_prod.sh deploy-full
#   ./deploy/manage_prod.sh renew-dry-run
#   ./deploy/manage_prod.sh logs proxy
#   ./deploy/manage_prod.sh restart backend
# ----------------------------------------------------------------------------
# 安全注意：
#   - 脚本假设你已经能免密 SSH 到服务器 (已配置私钥)。
#   - 如需密码登录，请在 SSH 命令增加 -o 选项或交互；不推荐写入脚本。
# ----------------------------------------------------------------------------
# 环境变量说明 (可在执行前 export 覆盖)：
#   PROD_HOST        远程服务器 IP 或域名
#   SSH_USER         SSH 用户名 (通常 root 或 ubuntu)
#   REMOTE_DIR       远程项目根目录 (docker-compose.prod.yml 所在)
#   COMPOSE_FILE     生产 compose 文件名
#   DOMAIN_API       API 子域 (用于 certbot 与展示)
#   ENABLE_SYNC_CODE 是否同步代码目录 (默认 false, 避免覆盖远程正在运行的版本)
# ----------------------------------------------------------------------------
# 初始默认值：
PROD_HOST=${PROD_HOST:-"47.238.75.96"}
SSH_USER=${SSH_USER:-"root"}
REMOTE_DIR=${REMOTE_DIR:-"/root/myblog-py-django-ts-react"}
COMPOSE_FILE=${COMPOSE_FILE:-"docker-compose.prod.yml"}
DOMAIN_API=${DOMAIN_API:-"api.wangshixin.me"}
ENABLE_SYNC_CODE=${ENABLE_SYNC_CODE:-"false"}

# 颜色输出帮助可视化
COLOR_RED="\033[31m"; COLOR_GREEN="\033[32m"; COLOR_YELLOW="\033[33m"; COLOR_BLUE="\033[34m"; COLOR_RESET="\033[0m"

# 打印带颜色的信息函数
info()  { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $*"; }
success(){ echo -e "${COLOR_GREEN}[OK]  ${COLOR_RESET} $*"; }
warn()  { echo -e "${COLOR_YELLOW}[WARN]${COLOR_RESET} $*"; }
error() { echo -e "${COLOR_RED}[ERR] ${COLOR_RESET} $*"; }

# 检查本地必须存在的命令：ssh / scp / docker
check_prerequisites() {
  local missing=()
  for cmd in ssh scp docker; do
    command -v "$cmd" >/dev/null 2>&1 || missing+=("$cmd")
  done
  if [ ${#missing[@]} -gt 0 ]; then
    error "缺少命令: ${missing[*]} 请先安装后再运行此脚本。"
    exit 1
  fi
}

# 显示帮助与子命令列表
show_help() {
  cat <<EOF
用法: $0 <子命令>
子命令列表(按常用程度排序):
  help                显示本帮助
  deploy-full         全量：可选代码同步 + 构建镜像 + 启动容器
  build               仅构建后端与前端镜像 (不启动)
  up                  启动或更新所有服务 (不强制重建镜像)
  status              查看当前容器运行状态 (docker compose ps)
  logs <svc>          查看指定服务最近日志 (proxy/backend/frontend/db)
  restart <svc>       重启指定服务 (例如 backend)
  renew               Certbot 正式续期证书 (需要证书接近过期才有变化)
  renew-dry-run       模拟续期 (测试自动续期链路, 不改变证书文件)
  sync-config         仅同步关键配置文件 (nginx.conf 等)
  sync-code           同步后端 / 前端代码目录 (谨慎：会覆盖远程)
  self-test           运行快速巡检：环境变量 + proxy/backend 状态 + 证书有效期
  show-env            显示脚本当前使用的环境变量值

环境变量可覆盖默认：
  export PROD_HOST=1.2.3.4 SSH_USER=root DOMAIN_API=api.example.com
  ENABLE_SYNC_CODE=true 允许 deploy-full 同步源码

示例：
  $0 deploy-full
  $0 logs backend
  ENABLE_SYNC_CODE=true $0 deploy-full
EOF
}

# 同步配置文件（安全：只读）
sync_config() {
  info "同步 nginx.conf 到远程..."
  scp deploy/nginx.conf "${SSH_USER}@${PROD_HOST}:${REMOTE_DIR}/deploy/nginx.conf" || { error "同步 nginx.conf 失败"; exit 1; }
  success "配置文件同步完成"
}

# 可选：同步代码（谨慎操作）
sync_code() {
  if [ "${ENABLE_SYNC_CODE}" != "true" ]; then
    warn "ENABLE_SYNC_CODE!=true，跳过代码同步。设置 ENABLE_SYNC_CODE=true 后再执行。"
    return 0
  fi
  info "开始代码同步：优先使用 rsync (断点续传/删除已删文件)，回退到 scp。"
  # 排除可再生成或不必要的大目录 (如 __pycache__ 与 node_modules/.venv)。
  RSYNC_EXCLUDES=("--exclude=__pycache__" "--exclude=.venv" "--exclude=node_modules" "--exclude=db.sqlite3")
  if command -v rsync >/dev/null 2>&1; then
    info "使用 rsync 同步后端目录..."
    rsync -az --delete "${RSYNC_EXCLUDES[@]}" myblog-backend-django/ "${SSH_USER}@${PROD_HOST}:${REMOTE_DIR}/myblog-backend-django/" || rsync_backend_fail=1
    if [ "${rsync_backend_fail}" = "1" ]; then
      warn "rsync 后端失败，尝试 scp 回退..."
      scp -r myblog-backend-django "${SSH_USER}@${PROD_HOST}:${REMOTE_DIR}/" || { error "后端代码同步失败"; exit 1; }
    fi
    info "使用 rsync 同步前端目录..."
    rsync -az --delete "${RSYNC_EXCLUDES[@]}" myblog-frontend-react/ "${SSH_USER}@${PROD_HOST}:${REMOTE_DIR}/myblog-frontend-react/" || rsync_frontend_fail=1
    if [ "${rsync_frontend_fail}" = "1" ]; then
      warn "rsync 前端失败，尝试 scp 回退..."
      scp -r myblog-frontend-react "${SSH_USER}@${PROD_HOST}:${REMOTE_DIR}/" || { error "前端代码同步失败"; exit 1; }
    fi
  else
    warn "未找到 rsync，使用 scp 全量复制 (可能较慢且不删除远端已删文件)。"
    scp -r myblog-backend-django "${SSH_USER}@${PROD_HOST}:${REMOTE_DIR}/" || { error "后端代码同步失败"; exit 1; }
    scp -r myblog-frontend-react "${SSH_USER}@${PROD_HOST}:${REMOTE_DIR}/" || { error "前端代码同步失败"; exit 1; }
  fi
  success "代码同步完成"
}

# 构建镜像（后端 + 前端），使用远程 docker compose build
build_images() {
  # 版本来源：本地 git 提交短 SHA；若失败则使用 unknown
  local version
  version=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  info "远程构建镜像 (backend / frontend) 版本号: ${version}"
  # 通过 docker compose --build-arg 传递 APP_VERSION 给 Dockerfile 中的 ARG
  ssh "${SSH_USER}@${PROD_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} build --build-arg APP_VERSION=${version} backend frontend" || { error "构建失败"; exit 1; }
  success "镜像构建完成 (APP_VERSION=${version})"
}

# 启动或更新容器
up_services() {
  info "启动/更新全部服务 (不会强制重建镜像) ..."
  ssh "${SSH_USER}@${PROD_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} up -d" || { error "启动失败"; exit 1; }
  success "服务已启动/更新"
}

# 显示容器状态
show_status() {
  info "获取容器状态..."
  ssh "${SSH_USER}@${PROD_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} ps" || { error "状态获取失败"; exit 1; }
}

# 查看指定服务日志（最后 100 行）
show_logs() {
  local svc="$1"
  if [ -z "$svc" ]; then error "请提供服务名，如: logs backend"; exit 1; fi
  info "获取 ${svc} 最近日志..."
  ssh "${SSH_USER}@${PROD_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} logs --no-color --tail=100 ${svc}" || { error "日志获取失败"; exit 1; }
}

# 重启指定服务
restart_service() {
  local svc="$1"
  if [ -z "$svc" ]; then error "请提供服务名，如: restart backend"; exit 1; fi
  info "重启服务 ${svc} ..."
  ssh "${SSH_USER}@${PROD_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} restart ${svc}" || { error "重启失败"; exit 1; }
  success "${svc} 已重启"
}

# 证书正式续期（实际执行 certbot renew）
renew_cert() {
  info "执行正式证书续期 (若未到期通常显示无变化)..."
  ssh "${SSH_USER}@${PROD_HOST}" "certbot renew" || { error "续期命令失败"; exit 1; }
  success "续期命令执行结束"
}

# 证书 dry-run 模拟
renew_cert_dry() {
  info "执行证书续期 dry-run 模拟..."
  ssh "${SSH_USER}@${PROD_HOST}" "certbot renew --dry-run" || { error "dry-run 失败"; exit 1; }
  success "dry-run 成功 (链路正常)"
}

# 显示当前脚本使用的环境变量
show_env() {
  cat <<EOF
当前环境变量:
  PROD_HOST=${PROD_HOST}
  SSH_USER=${SSH_USER}
  REMOTE_DIR=${REMOTE_DIR}
  COMPOSE_FILE=${COMPOSE_FILE}
  DOMAIN_API=${DOMAIN_API}
  ENABLE_SYNC_CODE=${ENABLE_SYNC_CODE}
EOF
}

# 自检：不做变更，仅汇总关键信息
self_test() {
  check_prerequisites
  info "[STEP] 环境变量概览"
  show_env
  info "[STEP] 容器状态"
  ssh "${SSH_USER}@${PROD_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} ps" || { error "获取容器状态失败"; exit 1; }
  info "[STEP] 后端健康 (容器内 Python urllib 请求 /api/health/)"
  ssh "${SSH_USER}@${PROD_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} exec -T backend python - <<'PYEOF' || echo '后端健康检查失败'
import urllib.request, urllib.error, sys
URL = 'http://localhost:8000/api/health/'
req = urllib.request.Request(URL, headers={'Host': 'api.wangshixin.me'})
try:
    resp = urllib.request.urlopen(req, timeout=5)
    data = resp.read().decode()
    print(data)
except Exception as e:
    print('HEALTH ERROR:', e)
    sys.exit(1)
PYEOF" || true
  info "[STEP] 证书过期时间"
  ssh "${SSH_USER}@${PROD_HOST}" "openssl x509 -in /etc/letsencrypt/live/${DOMAIN_API}/fullchain.pem -noout -enddate" || warn "无法读取证书 (尚未签发?)"
  success "自检完成。如有 WARN/ERR 请逐项排查。"
}

# 全量部署：可选同步代码 + 配置 → 构建 → 启动 → 状态
deploy_full() {
  check_prerequisites
  sync_config
  sync_code
  build_images
  up_services
  show_status
  success "全量部署完成。"
}

# 主调度：解析第一个参数为子命令
main() {
  local cmd="$1"; shift || true
  case "$cmd" in
    help|--help|-h)      show_help ;;
    deploy-full)        deploy_full ;;
    build)              check_prerequisites; build_images ;;
    up)                 check_prerequisites; up_services ;;
    status)             check_prerequisites; show_status ;;
    logs)               check_prerequisites; show_logs "$1" ;;
    restart)            check_prerequisites; restart_service "$1" ;;
    renew)              check_prerequisites; renew_cert ;;
    renew-dry-run)      check_prerequisites; renew_cert_dry ;;
    sync-config)        check_prerequisites; sync_config ;;
    sync-code)          check_prerequisites; ENABLE_SYNC_CODE=true; sync_code ;;
    self-test)          self_test ;;
    show-env)           show_env ;;
    ""|*)               warn "未知或未提供子命令: '$cmd'"; show_help; [ -z "$cmd" ] || exit 1 ;;
  esac
}

main "$@"
