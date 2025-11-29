# ============================================================
# Django 后端 Dockerfile
# ============================================================

# 使用 Python 3.12 的精简版镜像（基于 Debian）
# slim 版本比 alpine 更兼容 Python 原生扩展（如 psycopg2）
FROM python:3.12-slim AS base

# 构建参数：可在 docker build 传入实际 Git 提交或版本号
ARG APP_VERSION=unknown

# 设置环境变量
# PYTHONDONTWRITEBYTECODE=1：不生成 .pyc 字节码文件（减少容器体积）
# PYTHONUNBUFFERED=1：Python 输出直接打印到终端（不缓冲），便于查看日志
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_VERSION=${APP_VERSION}

# 设置工作目录
WORKDIR /app

# 安装系统依赖（PostgreSQL 客户端库和编译工具）需在pip install之前安装
# libpq-dev：PostgreSQL 客户端开发库（psycopg 需要）
# gcc：C 编译器（编译 psycopg 的 C 扩展需要）
# curl：用于健康检查
# --no-install-recommends：只安装必需依赖，减少镜像体积
# rm -rf /var/lib/apt/lists/*：删除 apt 缓存，进一步减小体积
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 先复制依赖清单文件（利用 Docker 缓存机制）
# 只要 requirements.txt 不变，这一层就会被缓存，加速构建
COPY requirements.txt .

# 安装 Python 依赖
# --no-cache-dir：不保存 pip 缓存，减少镜像体积
# -r requirements.txt：从文件读取依赖列表
RUN pip install --no-cache-dir -r requirements.txt

# 复制整个项目代码到容器
COPY . .

# 创建非 root 用户（安全最佳实践）
# -m：创建用户主目录
# appuser：用户名
RUN useradd -m appuser && \
    # 将 /app 目录的所有权给 appuser
    chown -R appuser:appuser /app

# 切换到非特权用户
USER appuser

# 暴露 8000 端口（Django 默认端口）
EXPOSE 8000

# 默认启动命令（生产模式）
# 使用 Gunicorn WSGI 服务器（比 runserver 性能更好）
# --bind 0.0.0.0:8000：监听所有网络接口
# --workers 3：启动 3 个工作进程（一般设置为 CPU 核心数 * 2 + 1）
# myblog.wsgi:application：指定 WSGI 应用入口
CMD ["gunicorn", "myblog.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]