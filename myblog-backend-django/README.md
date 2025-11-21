# myblog-django

- 类型：Python 项目
- 创建时间：2025-11-08
- Python 版本：Python 3.12.12
- 虚拟环境：`.venv`
- Git 初始化：否
- 快速启动：
  ```bash
  cd /Users/jayden/development/practice/python/myblog-django
  source .venv/bin/activate
  ```

## 生产环境部署 (Deployment to Production)

### 静态文件配置 (Static Files)

本项目已配置 WhiteNoise 用于在生产环境中服务静态文件（CSS、JavaScript、images 等）。

**部署到 Render 时的注意事项：**

1. 在 Render 的 Build Command 中，需要添加 `collectstatic` 命令：
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```

2. 确保设置以下环境变量：
   - `SECRET_KEY`: 生产环境密钥（必须）
   - `ALLOWED_HOSTS`: 允许的域名，用逗号分隔（例如：`your-app.onrender.com`）
   - `DATABASE_URL`: PostgreSQL 数据库连接字符串（可选，不设置则使用 SQLite）

3. Start Command 保持为：
   ```bash
   gunicorn myblog.wsgi:application
   ```

WhiteNoise 将自动处理静态文件的压缩和缓存，无需额外配置 Nginx 或 CDN。
