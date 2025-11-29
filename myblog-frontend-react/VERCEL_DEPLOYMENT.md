# Vercel 部署指南（零基础版）

> 📌 **面向人群**：完全没有部署经验的初学者  
> ⏱️ **预计时间**：15-20 分钟  
> 💰 **费用**：免费（个人项目绰绰有余）

---

## 📚 **基础知识：什么是 Vercel？**

### **Vercel 是什么？**

Vercel 是一个**前端托管平台**，专为 React/Vue/Next.js 等现代前端项目设计。

### **为什么选择 Vercel？**

-   **零配置部署**：连接 GitHub 后，推送代码就自动部署
-   **全球 CDN**：访问速度快，自带 HTTPS 证书
-   **免费额度**：个人博客完全够用，无需信用卡
-   **自定义域名**：支持绑定你自己的域名（如 `www.wangshixin.me`）

### **它和后端的关系？**

```
用户访问 www.wangshixin.me
    ↓
Vercel 提供前端页面（HTML/CSS/JS）
    ↓
前端调用 API: https://api.wangshixin.me
    ↓
你的服务器处理后端逻辑（Django）
```

---

## 🚀 **第一步：准备工作**

### **1.1 确认项目已推送到 GitHub**

检查你的 GitHub 仓库是否包含前端代码：

```
https://github.com/wanglovesym/myblog-py-django-ts-react
```

确保 `myblog-frontend-react` 文件夹在仓库中。

### **1.2 确认文件已创建**

在 `myblog-frontend-react` 目录下，应该包含以下文件：

-   ✅ `src/config/api.ts` - API 配置文件
-   ✅ `.env.development` - 本地开发环境变量
-   ✅ `.env.production` - 生产环境变量

---

## 🔑 **第二步：注册 Vercel 账号**

### **2.1 访问 Vercel 官网**

打开浏览器，访问：[https://vercel.com](https://vercel.com)

### **2.2 选择登录方式**

点击 **"Sign Up"**，推荐用 GitHub 账号登录：

-   点击 **"Continue with GitHub"**
-   授权 Vercel 访问你的 GitHub 仓库
-   完成后会跳转到 Vercel Dashboard（控制面板）

---

## 📦 **第三步：导入项目**

### **3.1 新建项目**

在 Vercel Dashboard 点击 **"Add New..."** → **"Project"**

### **3.2 选择仓库**

-   找到你的仓库：`myblog-py-django-ts-react`
-   点击 **"Import"**

### **3.3 配置项目设置**

⚠️ **关键配置！** 请仔细填写：

| 配置项               | 填写内容                      | 说明                      |
| -------------------- | ----------------------------- | ------------------------- |
| **Project Name**     | `myblog-frontend`（可自定义） | 项目名称，影响默认域名    |
| **Framework Preset** | `Vite`                        | Vercel 会自动检测         |
| **Root Directory**   | `myblog-frontend-react`       | **重要！** 指定前端文件夹 |
| **Build Command**    | `npm run build`               | 默认即可                  |
| **Output Directory** | `dist`                        | Vite 默认输出目录         |

### **3.4 设置环境变量**

点击 **"Environment Variables"**，添加：

| Name                | Value                       | Environment   |
| ------------------- | --------------------------- | ------------- |
| `VITE_API_BASE_URL` | `https://api.wangshixin.me` | Production ✅ |

> 📌 **Environment 选项说明**：
>
> -   **Production**：生产环境（用户实际访问）
> -   **Preview**：预览环境（Pull Request 自动生成）
> -   **Development**：开发环境（本地 `vercel dev` 命令）
>
> 建议全部勾选，确保所有环境都能连接到后端。

### **3.5 开始部署**

点击 **"Deploy"** 按钮，等待 1-2 分钟。

---

## 🎉 **第四步：验证部署**

### **4.1 访问默认域名**

部署成功后，Vercel 会分配一个默认域名，类似：

```
https://myblog-frontend.vercel.app
```

点击链接访问，检查：

-   ✅ 页面是否正常显示
-   ✅ 打开浏览器控制台（F12），切换到 **Network** 标签
-   ✅ 刷新页面，观察 API 请求是否指向 `https://api.wangshixin.me`

### **4.2 常见问题排查**

| 问题             | 检查方法                              | 解决办法                                 |
| ---------------- | ------------------------------------- | ---------------------------------------- |
| **页面空白**     | 控制台是否有红色错误？                | 检查 `Root Directory` 是否正确           |
| **API 404 错误** | Network 标签查看请求地址              | 确认 `VITE_API_BASE_URL` 环境变量        |
| **CORS 错误**    | 错误信息包含 "blocked by CORS policy" | 后端 `CORS_ALLOWED_ORIGINS` 需加前端域名 |

---

## 🌐 **第五步：绑定自定义域名（www.wangshixin.me）**

### **5.1 进入域名设置**

在 Vercel 项目页面：

1. 点击 **"Settings"** 标签
2. 左侧菜单选择 **"Domains"**

### **5.2 添加自定义域名**

1. 输入框中填写：`www.wangshixin.me`
2. 点击 **"Add"** 按钮
3. Vercel 会显示 DNS 配置指引

### **5.3 配置 DNS 记录**

#### **选项 A：CNAME 记录（推荐）**

登录你的域名 DNS 管理面板（阿里云/Cloudflare 等），添加：

| 类型  | 主机记录 | 记录值                 |
| ----- | -------- | ---------------------- |
| CNAME | `www`    | `cname.vercel-dns.com` |

#### **选项 B：A 记录**

| 类型 | 主机记录 | 记录值        |
| ---- | -------- | ------------- |
| A    | `www`    | `76.76.21.21` |

> 📌 **注意**：
>
> -   记录值以 Vercel Dashboard 实际显示为准
> -   TTL（生存时间）可设为 `600`（10 分钟）

### **5.4 等待 DNS 生效**

-   **验证时间**：通常 5-10 分钟（最长 24 小时）
-   **验证方法**：在终端运行 `nslookup www.wangshixin.me`

```bash
nslookup www.wangshixin.me
# 应该显示：
# Non-authoritative answer:
# www.wangshixin.me  canonical name = cname.vercel-dns.com
```

### **5.5 HTTPS 自动签发**

DNS 生效后：

-   Vercel 自动签发 Let's Encrypt 证书
-   几分钟内就能通过 `https://www.wangshixin.me` 访问
-   证书自动续期，无需手动操作

---

## 🔄 **第六步：自动部署配置**

### **6.1 Git 自动部署**

现在每次你推送代码到 GitHub，Vercel 会自动：

1. 检测到代码变化
2. 拉取最新代码
3. 运行 `npm run build`
4. 部署到生产环境

### **6.2 查看部署历史**

在 Vercel Dashboard：

-   **Deployments** 标签：查看所有部署记录
-   每次部署都有独立 URL，可以回滚到任意版本

### **6.3 预览环境**

创建 Pull Request 时，Vercel 会自动生成预览链接：

```
https://myblog-frontend-git-feature-xyz.vercel.app
```

用于测试新功能，不影响生产环境。

---

## 📝 **常见操作**

### **修改环境变量**

1. Vercel Dashboard → 选择项目
2. **Settings** → **Environment Variables**
3. 找到 `VITE_API_BASE_URL`，点击 **"Edit"**
4. 修改后点击 **"Save"**
5. ⚠️ **重要**：需要重新部署才能生效！
    - 点击 **"Deployments"** → 最新部署的 **"..."** → **"Redeploy"**

### **查看构建日志**

如果部署失败：

1. **Deployments** → 点击失败的部署
2. 查看 **"Build Logs"** 标签页
3. 红色错误信息会提示问题原因

### **删除项目**

1. **Settings** → **General** → 拉到最下方
2. 点击 **"Delete Project"**
3. 输入项目名称确认

---

## 🔐 **安全提示**

### **环境变量安全**

✅ **可以放在环境变量里的**：

-   API 地址（`VITE_API_BASE_URL`）
-   公开的服务密钥（如 Google Analytics ID）

❌ **不能放的**：

-   数据库密码
-   私钥文件
-   后端 SECRET_KEY

> 原因：`VITE_` 开头的变量会打包到前端 JS 文件中，用户可以看到！

### **CORS 配置确认**

确保后端 `settings.py` 已添加前端域名：

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",         # 本地开发
    "https://www.wangshixin.me",     # 生产域名
]

CSRF_TRUSTED_ORIGINS = [
    "https://api.wangshixin.me",     # 后端域名
    "https://www.wangshixin.me",     # 前端域名
]
```

---

## 🐛 **故障排除**

### **问题 1：页面显示但 API 请求失败**

**症状**：打开控制台看到 `Failed to fetch` 或 `Network Error`

**检查步骤**：

1. 打开浏览器控制台 → Network 标签
2. 刷新页面，观察 API 请求的 URL
3. 如果显示 `http://localhost:8000`，说明环境变量没生效

**解决办法**：

-   确认 Vercel 环境变量中有 `VITE_API_BASE_URL`
-   重新部署项目（环境变量修改后必须重新构建）

### **问题 2：CORS 错误**

**症状**：控制台显示 `Access to fetch at 'https://api.wangshixin.me' from origin 'https://www.wangshixin.me' has been blocked by CORS policy`

**解决办法**：

1. SSH 登录你的服务器
2. 编辑 `myblog-backend-django/myblog/settings.py`
3. 确认 `CORS_ALLOWED_ORIGINS` 包含前端域名
4. 重启后端服务：
    ```bash
    cd /root/myblog-py-django-ts-react
    docker compose -f docker-compose.prod.yml restart backend
    ```

### **问题 3：域名无法访问**

**症状**：`www.wangshixin.me` 打不开

**检查步骤**：

1. 终端运行 `nslookup www.wangshixin.me`
2. 如果返回 `NXDOMAIN`，说明 DNS 未生效
3. 等待 10-30 分钟后再试

**解决办法**：

-   确认 DNS 记录配置正确（CNAME 指向 `cname.vercel-dns.com`）
-   检查是否有冲突的 DNS 记录（如旧的 A 记录）
-   联系域名服务商客服

---

## 📚 **进阶操作**

### **配置 Redirect（可选）**

如果你想让 `wangshixin.me`（不带 www）自动跳转到 `www.wangshixin.me`：

1. Vercel Dashboard → **Domains**
2. 添加 `wangshixin.me`（不带 www）
3. Vercel 会自动配置 301 重定向

### **性能优化**

Vercel 已自动优化：

-   ✅ Gzip/Brotli 压缩
-   ✅ HTTP/2 + HTTP/3
-   ✅ 图片自动优化（需配置）
-   ✅ 全球 CDN 缓存

---

## 🎓 **概念解释**

### **1. 什么是环境变量？**

环境变量就像"配置开关"，不同环境下使用不同的值：

| 环境           | API 地址                    | 用途               |
| -------------- | --------------------------- | ------------------ |
| 开发（本地）   | `http://localhost:8000`     | 你在电脑上写代码时 |
| 生产（Vercel） | `https://api.wangshixin.me` | 用户访问网站时     |

### **2. 为什么要用 `VITE_` 前缀？**

Vite 的安全机制：

-   **`VITE_` 开头**：打包时替换到代码中，浏览器可访问
-   **无前缀**：只在构建脚本中可用，不会泄露到前端

示例：

```javascript
// ✅ 可以用（打包后变成 https://api.wangshixin.me）
const API = import.meta.env.VITE_API_BASE_URL;

// ❌ 浏览器看不到（构建时被忽略）
const SECRET = import.meta.env.DATABASE_PASSWORD;
```

### **3. 什么是 CDN？**

**CDN**（内容分发网络）：

-   Vercel 在全球部署了上百个服务器节点
-   用户访问时，自动连接到最近的节点
-   国内用户访问速度快，海外用户也快

对比：

-   **无 CDN**：所有用户都访问你服务器（中国香港），海外用户慢
-   **有 CDN**：美国用户访问美国节点，中国用户访问中国节点

---

## ✅ **完成检查清单**

部署成功的标志：

-   [ ] 能通过 `https://www.wangshixin.me` 访问前端页面
-   [ ] 浏览器控制台无红色错误
-   [ ] 文章列表能正常加载（数据来自后端 API）
-   [ ] 点击文章能查看详情页
-   [ ] 搜索功能正常工作

---

## 🆘 **获取帮助**

如果遇到问题：

1. **查看 Vercel 文档**：[https://vercel.com/docs](https://vercel.com/docs)
2. **GitHub Issues**：在你的仓库提 Issue
3. **Vercel 社区论坛**：[https://github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🎉 **恭喜！**

现在你的博客前端已成功部署到 Vercel，拥有：

✅ 自动 HTTPS  
✅ 全球 CDN 加速  
✅ 自定义域名  
✅ 自动部署（Git push 即上线）  
✅ 免费托管

**下一步建议**：

-   添加更多博客文章
-   配置 Google Analytics 统计访问量
-   自定义域名的 SEO 优化
-   添加评论系统（如 Giscus）

Happy Coding! 🚀
