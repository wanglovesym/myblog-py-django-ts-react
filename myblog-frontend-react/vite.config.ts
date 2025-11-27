import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                // Docker 环境下使用服务名 backend，本地开发使用 localhost
                // 通过环境变量 VITE_BACKEND_HOST 控制（默认 localhost）
                target:
                    process.env.VITE_BACKEND_HOST || "http://localhost:8000",
                changeOrigin: true
            }
        }
    }
});
