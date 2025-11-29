# 🔐 SSH 公钥登录报错完整解决方案笔记

> 适用场景：首次连接云服务器（ECS/VPS）出现 `Permission denied (publickey)`。本文提供原因分析、三套可选方案与美化后的操作清单，可直接作为博客文章发布。

---

## 🧭 问题概述

-   报错信息：
    ```
    The authenticity of host '47.238.75.96 (47.238.75.96)' can't be established.
    ED25519 key fingerprint is SHA256:...
    Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
    Warning: Permanently added '47.238.75.96' (ED25519) to the list of known hosts.
    root@47.238.75.96: Permission denied (publickey).
    ```
-   本质原因：服务器开启了“仅公钥登录”，但客户端未正确使用已授权的私钥，或服务器端没有你的公钥授权。

---

## 🧩 原因分析（Checklist）

-   🔑 未绑定密钥对：云控制台中实例未绑定你的密钥对（服务器端无公钥）。
-   🗝️ 客户端未指定私钥：本机 SSH 未正确选择用于该主机的私钥，或私钥权限不合规（需 600）。
-   🔐 登录策略限制：`/etc/ssh/sshd_config` 禁止密码/禁用 root 导致无法临时登录授权（本案例主要是密钥问题）。

---

## 🚀 方案 A：控制台创建并绑定密钥对（推荐）

1. 在云平台（如阿里云 ECS）控制台创建密钥对，下载 `.pem/.key` 到本机 `~/.ssh/`。
2. 在实例操作中“绑定/更换密钥对”，选择刚创建的密钥对。
3. 本机设置权限并登录：
    ```bash
    chmod 600 ~/.ssh/aliyun-hk.pem
    ssh -i ~/.ssh/aliyun-hk.pem root@47.238.75.96
    ```

> 优点：安全、规范、无需临时开密码登录。

---

## 🧰 方案 B：临时密码登录，再手动授权你的公钥

1. 控制台“重置实例密码”，设置 `root` 或创建普通用户 `deploy` 的密码。
2. 使用密码登录：
    ```bash
    ssh root@47.238.75.96
    ```
3. 登录后授权你的公钥（以 `deploy` 为例）：

    ```bash
    adduser deploy
    usermod -aG sudo deploy

    mkdir -p /home/deploy/.ssh
    echo "<本机 ~/.ssh/id_ed25519.pub 的全部内容>" >> /home/deploy/.ssh/authorized_keys
    chmod 700 /home/deploy/.ssh
    chmod 600 /home/deploy/.ssh/authorized_keys
    chown -R deploy:deploy /home/deploy/.ssh
    ```

4. 本机用对应私钥登录：
    ```bash
    ssh deploy@47.238.75.96
    ```

> 提示：完成授权后，建议关闭密码登录，回到仅公钥模式（更安全）。

---

## 🧙 方案 C：配置本机自动选用私钥（提升体验）

1. 将私钥加入 macOS 钥匙串与 ssh-agent：
    ```bash
    chmod 600 ~/.ssh/my-macbook-pro.pem
    ssh-add --apple-use-keychain ~/.ssh/my-macbook-pro.pem
    # 旧版 macOS 可用：ssh-add -K ~/.ssh/my-macbook-pro.pem
    ```
2. 配置 `~/.ssh/config`：

    ```sshconfig
    Host 47.238.75.96
      User root
      IdentityFile ~/.ssh/my-macbook-pro.pem
      IdentitiesOnly yes
      AddKeysToAgent yes
      UseKeychain yes

    Host aliyun-hk
      HostName 47.238.75.96
      User root
      IdentityFile ~/.ssh/my-macbook-pro.pem
      IdentitiesOnly yes
      AddKeysToAgent yes
      UseKeychain yes
    ```

3. 之后可直接：
    ```bash
    ssh root@47.238.75.96
    # 或
    ssh aliyun-hk
    ```

> 体验：像 GitHub 一样无需每次 `-i` 指定私钥。

---

## 🛡️ 服务器侧登录策略（仅排错时调整）

-   编辑 `/etc/ssh/sshd_config`：
    ```
    PermitRootLogin yes            # 若需 root 直连（更推荐普通用户）
    PasswordAuthentication yes     # 临时开启以授权公钥，完成后建议改回 no
    ```
-   重启 SSH：
    ```bash
    sudo systemctl restart sshd
    ```

---

## 🧪 调试与验证

-   客户端查看实际使用的密钥：
    ```bash
    ssh -v root@47.238.75.96
    ```
-   私钥与配置权限：
    ```bash
    ls -l ~/.ssh/my-macbook-pro.pem   # 应为 -rw------- (600)
    ls -l ~/.ssh/config               # 建议 600
    ```
-   服务端授权：
    ```bash
    cat ~/.ssh/authorized_keys        # 是否含你的公钥
    ```

---

## ✅ 最佳实践

-   优先用云平台“密钥对绑定”，避免长期开启密码登录。
-   本机启用 `~/.ssh/config` + 钥匙串保存，简化后续连接。
-   私钥权限严格控制（600），避免通过 IM/邮件传输私钥。
-   生产建议使用普通用户（如 `deploy`）登录，必要时 `sudo` 执行管理命令。

---

## 🎉 最终结果

-   已实现直接 `ssh root@47.238.75.96` 登录，无需每次 `-i` 指定私钥。
-   方案落地：云端密钥绑定 + 本机钥匙串与 SSH 配置自动选择私钥。

> 后续我可以提供“只读部署用户 + 最小 sudo 权限”示例清单，进一步增强安全性。
