#!/usr/bin/env bash

###############################################################################
# certbot_setup.sh
# 目的：在全新或已有的 Ubuntu 服务器上，一次性申请并启用 Let’s Encrypt 免费
#       HTTPS 证书（webroot 模式）供 Nginx(容器 proxy)加载，随后验证与续期检查。
# 使用场景：你的域名 api.wangshixin.me 已正确解析到这台服务器公网 IP。
# 执行前提：
#   1. docker-compose.prod.yml 中 proxy 服务已挂载 /etc/letsencrypt 和 /var/www/certbot。
#   2. Nginx 的 80 端口 server 块中包含 /.well-known/acme-challenge/ 指向 /var/www/certbot。
#   3. 你已经拉取最新代码，并启动过 proxy（首次申请可不强制 https）。
#   4. 以具备 sudo 权限的用户运行（不要直接用 root，除非必要）。
# 快速示例：
#   sudo ./deploy/certbot_setup.sh --domain=api.example.com --email=ops@example.com
#   sudo ./deploy/certbot_setup.sh --domain=api.example.com --email=ops@example.com --staging  # 测试环境证书
#   sudo ./deploy/certbot_setup.sh --help  # 查看参数说明
# 申请成功后：
#   ls -l /etc/letsencrypt/live/api.example.com/
#   openssl x509 -in /etc/letsencrypt/live/api.example.com/fullchain.pem -noout -enddate
#   docker compose -f docker-compose.prod.yml restart proxy
# 正式上线前如果用了 --staging 需再次不带 --staging 申请一次。
#
# 脚本功能分阶段：
#   Phase 1: 参数与环境检查
#   Phase 2: 安装 Certbot (APT) 并准备 webroot
#   Phase 3: 申请初次证书（certbot certonly --webroot）
#   Phase 4: 验证证书文件存在与基本信息输出
#   Phase 5: 重启/加载 proxy 容器让 Nginx 使用证书
#   Phase 6: HTTPS 功能与安全头测试 (curl / openssl)
#   Phase 7: 续期机制检查 (systemd timer + dry-run)
#   Phase 8: 可选：清理旧临时文件 / 提示后续增强
#
# 重复执行安全性：已安装 Certbot 或已有目录不会报错（做幂等检测）。
# 失败恢复：若证书申请失败，可查看 /var/log/letsencrypt/letsencrypt.log。
###############################################################################

set -euo pipefail
shopt -s extglob

# ===================== 可选参数解析 =====================
# 支持: --domain=example.com --email=me@example.com --staging (使用 Let's Encrypt 测试环境)
# 使命: 提升复用性；默认变量仍可在脚本顶部直接改。
for arg in "$@"; do
  case "$arg" in
    --domain=*) DOMAIN="${arg#*=}" ; shift ;;
    --email=*)  EMAIL="${arg#*=}"  ; shift ;;
    --staging)  STAGING="true"     ; shift ;;
    --help|-h)  SHOW_HELP="true"    ; shift ;;
    *)          ;; # 忽略未知参数，保持幂等
  esac
done

if [[ "${SHOW_HELP:-}" == "true" ]]; then
  cat <<'USAGE'
用法: ./certbot_setup.sh [--domain=域名] [--email=邮箱] [--staging] [--help]
说明:
  --domain   申请证书的主域名 (默认脚本内置 DOMAIN)
  --email    接收到期提醒的邮箱 (默认脚本内置 EMAIL)
  --staging  使用 Let’s Encrypt 测试环境(不计正式额度, 证书不可信)
示例:
  ./certbot_setup.sh --domain=api.example.com --email=ops@example.com
  ./certbot_setup.sh --domain=api.example.com --email=ops@example.com --staging
USAGE
  exit 0
fi

STAGING="${STAGING:-false}" # 默认关闭测试环境

# ====== 可配置参数（根据需要修改） ======
DOMAIN="api.wangshixin.me"          # 目标域名（与 nginx.conf 中 server_name 匹配）
EMAIL="your-email@example.com"      # 用于接收到期提醒；需真实邮箱
WEBROOT_DIR="/var/www/certbot"      # 与 nginx 配置中 ACME challenge root 对应
COMPOSE_FILE="docker-compose.prod.yml" # 生产 compose 文件名称
PROXY_SERVICE_NAME="proxy"          # docker-compose 中反向代理服务名

# 输出颜色（提高可读性）
GREEN="\033[0;32m"; YELLOW="\033[1;33m"; RED="\033[0;31m"; BLUE="\033[0;34m"; RESET="\033[0m"

info()  { echo -e "${BLUE}[INFO]${RESET} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${RESET} $*"; }
error() { echo -e "${RED}[ERROR]${RESET} $*"; }
pass()  { echo -e "${GREEN}[OK]${RESET} $*"; }

# ====== Phase 1: 参数与基础检查 ======
info "开始环境检查 (Phase 1) - domain=${DOMAIN} email=${EMAIL} staging=${STAGING}" 

# 检查是否在服务器（简单依据：是否存在 /etc/os-release 且为 ubuntu）
if [[ -f /etc/os-release ]]; then
  source /etc/os-release
  if [[ ${ID} != "ubuntu" ]]; then
    warn "检测到当前系统不是 Ubuntu，APT 命令可能不适用 (ID=${ID})"
  fi
else
  warn "未找到 /etc/os-release，无法确认系统类型。"
fi

# 检查 sudo 权限（需要安装软件与访问 /etc/letsencrypt）
if ! sudo -n true 2>/dev/null; then
  warn "当前用户似乎没有免密 sudo；执行过程中可能需要输入密码。"
fi

missing_tools=()
for t in curl openssl docker; do command -v "$t" >/dev/null 2>&1 || missing_tools+=("$t"); done
if ! command -v dig >/dev/null 2>&1; then missing_tools+=("dig (建议安装 dnsutils)"); fi
if ! command -v certbot >/dev/null 2>&1; then info "后续将自动安装 certbot"; fi
if ((${#missing_tools[@]})); then warn "缺少工具: ${missing_tools[*]} (某些功能将降级或失败)"; fi

# 检测域名是否已解析到本服务器（比较 dig 与本机公网 IP）
SERVER_IP=$(curl -s https://ifconfig.me || echo "UNKNOWN")
DOMAIN_IP=$(dig +short A "$DOMAIN" | head -n1 || true)
info "检测公网 IP: $SERVER_IP"
info "域名解析 IP: ${DOMAIN_IP:-<empty>}"
if [[ -n "$DOMAIN_IP" && "$SERVER_IP" != "UNKNOWN" && "$DOMAIN_IP" != "$SERVER_IP" ]]; then
  warn "域名解析 IP ($DOMAIN_IP) 与服务器当前公网 IP ($SERVER_IP) 不一致，可能导致验证失败。"
fi

# ====== Phase 2: 安装 Certbot 与准备 webroot ======
info "安装 Certbot 与创建 webroot (Phase 2)"

if ! command -v certbot >/dev/null 2>&1; then
  info "Certbot 未安装，开始通过 APT 安装..."
  sudo apt update -y
  sudo apt install -y certbot
  pass "Certbot 安装完成"
else
  pass "Certbot 已存在，跳过安装"
fi
if ! command -v dig >/dev/null 2>&1; then
  info "安装 dnsutils 以提供 dig (可选)"
  sudo apt install -y dnsutils || warn "dnsutils 安装失败，可忽略但域名解析检查弱化"
fi

# 创建 webroot 目录（供 ACME 验证使用）
if [[ ! -d "$WEBROOT_DIR" ]]; then
  info "创建 webroot 目录: $WEBROOT_DIR"
  sudo mkdir -p "$WEBROOT_DIR"
  sudo chown "$USER":"$USER" "$WEBROOT_DIR"
else
  pass "webroot 目录已存在"
fi

# 放置测试文件以验证 Nginx 访问（手动可 curl http://DOMAIN/.well-known/acme-challenge/test）
TEST_CHALLENGE_DIR="$WEBROOT_DIR/.well-known/acme-challenge"
mkdir -p "$TEST_CHALLENGE_DIR"
TEST_FILE="$TEST_CHALLENGE_DIR/test.txt"
echo "webroot ok $(date)" > "$TEST_FILE"
info "已写入测试文件: $TEST_FILE"

# ====== Phase 3: 申请初次证书 ======
info "申请 Let’s Encrypt 证书 (Phase 3)"

# 检测是否已有有效证书（防止重复申请触发速率限制）
if [[ -d "/etc/letsencrypt/live/$DOMAIN" ]]; then
  warn "检测到已存在证书目录 /etc/letsencrypt/live/$DOMAIN，跳过首次申请。若需重新申请请手动删除或使用 --force-renewal。"
else
  # --webroot 指定验证目录；--agree-tos 同意服务条款；--no-eff-email 不订阅推广邮件
  CERTBOT_EXTRA=()
  if [[ "$STAGING" == "true" ]]; then CERTBOT_EXTRA+=("--staging"); fi
  # 预检 challenge 路径是否可访问 (HTTP 200/404 都说明端口可用, 其它可能阻塞)
  if command -v curl >/dev/null 2>&1; then
    CHK_CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://$DOMAIN/.well-known/acme-challenge/test.txt" || echo 000)
    if [[ "$CHK_CODE" == "000" ]]; then warn "无法访问 webroot 测试文件，80 端口或代理未就绪，可能导致验证失败"; fi
  fi
  sudo certbot certonly --webroot -w "$WEBROOT_DIR" -d "$DOMAIN" \
    --agree-tos -m "$EMAIL" --no-eff-email "${CERTBOT_EXTRA[@]}" || { error "证书申请失败，查看 /var/log/letsencrypt/letsencrypt.log"; exit 1; }
  pass "证书申请成功"
fi

# ====== Phase 4: 验证证书文件存在与信息输出 ======
info "验证证书文件 (Phase 4)"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
if [[ -f "$CERT_PATH/fullchain.pem" && -f "$CERT_PATH/privkey.pem" ]]; then
  pass "找到证书与私钥: $CERT_PATH"
  sudo openssl x509 -in "$CERT_PATH/fullchain.pem" -noout -subject -issuer -dates | sed 's/^/    > /'
else
  error "证书文件缺失，无法继续。"
  exit 1
fi

# ====== Phase 5: 让 Nginx(proxy) 使用证书 ======
info "重启/加载 proxy 服务 (Phase 5)"
# 若 proxy 尚未运行，尝试先启动它（只启动该服务，避免其它未准备好服务的干扰）
if [[ -f "$COMPOSE_FILE" ]]; then
  if ! docker compose -f "$COMPOSE_FILE" ps --services --status running | grep -q "^$PROXY_SERVICE_NAME$"; then
    info "proxy 未运行，尝试 docker compose up -d $PROXY_SERVICE_NAME"
    docker compose -f "$COMPOSE_FILE" up -d "$PROXY_SERVICE_NAME" || warn "proxy 启动失败，证书尚可用但 Nginx 未加载"
  else
    docker compose -f "$COMPOSE_FILE" restart "$PROXY_SERVICE_NAME" || warn "docker compose 重启失败，检查 compose 文件或服务名。"
  fi
  pass "proxy 服务处理完成"
else
  warn "未找到 $COMPOSE_FILE，跳过自动重启，请手动执行。"
fi

# ====== Phase 6: HTTPS 功能测试 ======
info "测试 HTTPS 访问与握手信息 (Phase 6)"
set +e
curl -sk -o /dev/null -w "HTTP_STATUS=%{http_code}\n" "https://$DOMAIN/api/" | sed 's/^/    > /'
curl -sk -I "https://$DOMAIN/admin/login/" | sed 's/^/    > /' | head -n5
# 使用 openssl 输出证书链中主体与颁发者
openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer | sed 's/^/    > /'
set -e

# ====== Phase 7: 续期机制验证 ======
info "检查续期 systemd timer 与 dry-run (Phase 7)"
if systemctl list-timers 2>/dev/null | grep -q certbot; then
  pass "检测到 certbot systemd 定时器"
else
  warn "未找到 certbot 定时器，可能发行版或安装方式不同，需手动 crontab。"
fi
# dry-run 模拟续期（不消耗真实额度）
sudo certbot renew --dry-run | sed 's/^/    > /'

# ====== Phase 8: 后续建议 ======
info "后续建议 (Phase 8)"
cat <<'EOF'
    > 建议：
    > 1. 定期查看 /var/log/nginx/error.log 监控证书加载情况。
    > 2. 若仅 API 功能，可在 HTTPS server 中移除前端代理 location / 节省资源。
    > 3. 可强化 CSP、开启 OCSP Stapling、考虑 ECDSA 证书以提升性能。
    > 4. 如需 Wildcard (*.wangshixin.me)，改用 DNS 验证：certbot -d *.wangshixin.me --manual --preferred-challenges dns。
EOF

pass "脚本执行完成。若使用 --staging，请再次使用正式模式重新申请生产证书。"
