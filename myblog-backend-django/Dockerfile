# 使用官方 Python 3.12 镜像（基于 Debian）
# slim 表示精简版
FROM python:3.12-slim

# 设置后续命令的默认工作目录
# 所有文件将复制到容器的 /app 目录下
# 相当于 RUN mkdir /app && cd /app
WORKDIR /app

# 安装系统依赖（PostgreSQL 客户端和编译工具）
# RUN: 在容器构建时执行shell命令
# libpq-dev: PostgreSQL 的 C头文件和库 (psycopg2&3依赖)
# gcc: 编译c扩展（如 psycopg3-biary 仍可能需要）
# postgresql-client: 包含 psql 命令（用于 wait-for-db.sh）
# rm -rf /var/lib/apt/lists/* 清理apt缓存，减小镜像体积
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件（利用 Docker 层缓存）
# 将本地 requirements.txt 复制到容器 /app/ 目录
# 策略：先复制依赖文件，再安装 → 利用 Docker 层缓存（依赖不变则跳过安装）
COPY requirements.txt .
# 不缓存 pip 下载的包，减小镜像体积
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目代码
# 将当前目录（myblog-backend-django/）所有文件复制到容器 /app/
# 注意：.dockerignore 会排除敏感文件（如 venv/、db.sqlite3）
COPY . .

# 收集静态文件（这对于 Django Admin 至关重要）
RUN python manage.py collectstatic --no-input

# 暴露端口（Django 默认 8000）
# EXPOSE：声明容器监听的端口（仅文档作用，不影响实际网络）
# 实际端口通过 docker run -p 8000:8000 或 docker-compose 绑定
EXPOSE 8000

# 生产环境启动命令（Gunicorn）
# CMD: 容器启动时执行的命令
# gunicore:
    # 生产级 WSGI (Web Server Gateway Interface)服务器
    # --bind 0.0.0.0:8000：gunicore 监听所有网络接口（容器内）
    # myblog.wsgi:application：Django 项目的 WSGI 应用入口
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myblog.wsgi:application"]