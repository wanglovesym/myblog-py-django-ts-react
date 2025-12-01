import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite 配置文件（vite.config.ts）
 *
 * 这份配置告诉 Vite：
 * - 使用哪些插件（React、Tailwind）来增强开发体验和构建能力；
 * - 在本地开发时，如何把前端的 /api 请求代理到后端，避免 CORS 问题；
 * - 其它可选配置（例如构建产物、部署基础路径 base、别名 alias 等）也都可以在这里设置。
 *
 * 入门要点：
 * - defineConfig：提供类型提示与更清晰的配置书写方式；
 * - plugins：按需引入，React 插件提供 JSX/快速刷新（Fast Refresh），Tailwind 插件集成 Tailwind；
 * - server.proxy：只在开发环境生效，生产部署请用 Nginx/反向代理或让前后端同域；
 * - 环境变量：以 VITE_ 开头的变量可在前端代码中使用（import.meta.env.VITE_*），也可在这里读取。
 */

// https://vite.dev/config/
export default defineConfig({
    // 插件：
    // - react(): 启用 React 支持（JSX、Fast Refresh 等）
    // - tailwindcss(): 集成 Tailwind（与 tailwind.config.js、postcss 配置协同）
    plugins: [react()],

    // 开发服务器配置（仅 dev 生效）：
    // 通过代理把前端发往 /api 的请求转发到后端，避免浏览器的跨域限制。
    server: {
        proxy: {
            "/api": {
                // 目标后端地址：
                // - 在 Docker 开发环境可设为容器/服务名，如 "http://backend:8000"
                // - 本地开发默认指向 http://localhost:8000
                // 使用环境变量 VITE_BACKEND_HOST 覆盖默认值：
                // 示例：在 myblog-frontend-react/.env.development 中写
                //   VITE_BACKEND_HOST=http://localhost:8000
                target:
                    process.env.VITE_BACKEND_HOST || "http://localhost:8000",

                // changeOrigin: 把请求头中的 Host 修改为目标地址的 Host，
                // 某些后端/网关依赖 Host 校验时很有用。
                changeOrigin: true

                // 若后端实际路径不是 /api 前缀，也可以在这里进行重写：
                // rewrite: (path) => path.replace(/^\/api/, "")
            }
        }
    }
});
