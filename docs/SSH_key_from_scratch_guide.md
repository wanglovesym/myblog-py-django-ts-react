# 🛠️ 从零创建本机 SSH 密钥并上传到服务器（脚本式指南）

> 目标：在本机生成新的 SSH 密钥对，安全地将公钥授权到服务器（ECS/VPS），实现免密登录。适用 macOS（zsh）/Linux 环境。

---

## 📦 前置条件

-   服务器开放 22/tcp（安全组/防火墙已允许）。
-   你拥有服务器的登录方式之一：
    -   临时密码（将用于首次登录并上传公钥），或
    -   云平台密钥对（已有私钥）。

---

## 1️⃣ 本机生成 SSH 密钥对

```bash
# 选择 ED25519（现代、高性能），备注便于识别（比如你的邮箱）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 按提示输入存储路径（建议默认 ~/.ssh/id_ed25519）与可选密码短语（增强私钥安全）
# 生成后将得到：
# - 私钥：~/.ssh/id_ed25519        （请勿泄露，权限需 600）
# - 公钥：~/.ssh/id_ed25519.pub    （可安全上传到服务器）

# 设置私钥权限（必须是 600）
chmod 600 ~/.ssh/id_ed25519

# 可选：将私钥加入 ssh-agent 并保存到 macOS 钥匙串
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
# 旧版 macOS 可用：ssh-add -K ~/.ssh/id_ed25519
```

---

## 2️⃣ 将公钥上传到服务器（安全授权）

### 方案 A：使用临时密码登录一次，然后授权（通用）

```bash
# 用密码登录（替换为你的服务器 IP/域名）
ssh root@<SERVER_IP>
# 或：ssh deploy@<SERVER_IP>
```

登录成功后，在服务器执行：

```bash
# 以 deploy 用户为例（推荐使用普通用户）
# 若没有该用户则创建，并加入 sudo（按需）
adduser deploy
usermod -aG sudo deploy

# 创建 SSH 目录与授权文件
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# 将本机公钥内容追加到授权文件（把本机公钥内容粘贴到这里）
# 本机公钥位于：~/.ssh/id_ed25519.pub
cat >> /home/deploy/.ssh/authorized_keys << 'EOF'
<将 ~/.ssh/id_ed25519.pub 的全部文本粘贴到这里>
EOF

# 设置权限与所有者
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

退出后，在本机测试免密登录：

```bash
ssh deploy@<SERVER_IP>
```

### 方案 B：有云平台密钥对（阿里云/腾讯云等）

-   在控制台创建密钥对并绑定到实例。
-   下载私钥到本机 `~/.ssh/` 并设置权限：
    ```bash
    chmod 600 ~/.ssh/<cloud-key>.pem
    ssh -i ~/.ssh/<cloud-key>.pem root@<SERVER_IP>
    ```
-   若还需把你的“自生成”公钥也授权到服务器，可在服务器执行与方案 A 相同的授权步骤，将 `~/.ssh/id_ed25519.pub` 追加到目标用户的 `authorized_keys`。

---

## 3️⃣ 优化：为目标主机设置默认私钥（免 `-i`）

```sshconfig
# 编辑 ~/.ssh/config（若不存在则创建），让该主机自动使用指定私钥
Host <SERVER_IP>
  User deploy                      # 也可用 root（生产更推荐普通用户）
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
  AddKeysToAgent yes
  UseKeychain yes                  # macOS：将密钥保存到钥匙串

# 可选：为服务器设置别名
Host my-server
  HostName <SERVER_IP>
  User deploy
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
  AddKeysToAgent yes
  UseKeychain yes
```

之后即可直接：

```bash
ssh deploy@<SERVER_IP>
# 或
ssh my-server
```

---

## 🧪 验证与常见问题

-   私钥权限：
    ```bash
    ls -l ~/.ssh/id_ed25519    # -rw-------
    ```
-   调试连接：
    ```bash
    ssh -v deploy@<SERVER_IP>
    ```
-   服务端策略：如遇登录失败，检查 `/etc/ssh/sshd_config`：
    ```
    PubkeyAuthentication yes
    PasswordAuthentication no   # 完成授权后建议关闭密码
    PermitRootLogin prohibit-password
    ```
    重启 SSH：
    ```bash
    sudo systemctl restart sshd
    ```

---

## ✅ 最佳实践

-   使用普通用户（如 `deploy`）登录，必要时 `sudo` 执行管理命令。
-   仅保留必要的密钥，私钥权限保持 600，避免通过 IM/邮件等渠道传输私钥。
-   云平台优先使用“密钥对绑定”，再按需追加个人公钥以支持多设备登录。
-   定期轮换密钥并审计 `~/.ssh/authorized_keys`。

---

## 🎯 结语

通过以上步骤，你已经从零完成了“本机生成 SSH 密钥 → 安全授权到服务器 → 免密登录与配置优化”的全流程。该流程适用于初学者与生产环境，兼顾安全与易用性。
