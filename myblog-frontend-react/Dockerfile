# ============================================================
# 第一阶段：构建阶段（build stage）
# ============================================================
# 使用 Node.js 24 的 Alpine Linux 基础镜像作为构建环境
# alpine 是轻量级 Linux 发行版，镜像体积小（~50MB）
# AS build 给这个阶段命名为 "build"，后续可以引用
FROM node:24-alpine AS build

# 设置容器内的工作目录为 /app
# 后续所有命令（COPY、RUN）都在这个目录下执行
WORKDIR /app

# 先单独复制 package.json 和 package-lock.json
# 这样做是为了利用 Docker 的层缓存机制：
# 只要依赖文件不变，这一层就不会重新构建，加速后续构建
COPY package*.json ./

# 安装 npm 依赖
# npm ci：根据 package-lock.json 精确安装依赖，比 npm install 更快更可靠
# || npm install：如果 npm ci 失败（例如没有 lock 文件），则降级使用 npm install
RUN npm ci || npm install

# 复制项目的所有源代码到容器的 /app 目录
# 此时依赖已安装完毕，改动源码不会触发依赖重装
COPY . .

# 执行 Vite 构建命令
# tsc -b：先用 TypeScript 编译器检查类型
# vite build：打包生成生产环境的静态文件到 dist/ 目录
RUN npm run build

# ============================================================
# 第二阶段：运行阶段（production stage）
# ============================================================
# 使用轻量级的 Nginx 镜像作为 Web 服务器
# 版本 1.27，基于 Alpine Linux，体积小且安全
FROM nginx:1.27-alpine

# 从第一阶段（build）中复制构建产物
# --from=build：指定从 "build" 阶段复制文件
# /app/dist：构建阶段生成的静态文件目录
# /usr/share/nginx/html：Nginx 默认的静态文件根目录
COPY --from=build /app/dist /usr/share/nginx/html

# 可选：如果需要自定义 Nginx 配置（例如路由重写、缓存策略）
# 可以创建 nginx.conf 文件并用下面的命令复制到容器
# COPY nginx.conf /etc/nginx/nginx.conf

# 声明容器对外暴露 80 端口（HTTP 默认端口）
# 这只是文档说明，实际端口映射由 docker run -p 或 compose 的 ports 配置
EXPOSE 80

# 容器启动时执行的命令
# nginx：启动 Nginx 服务器
# -g "daemon off;"：前台运行 Nginx（Docker 容器需要前台进程保持运行）
CMD ["nginx", "-g", "daemon off;"]