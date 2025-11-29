/**
 * ============================================================
 * API 配置文件
 * ============================================================
 *
 * 📌 为什么需要这个文件？
 *
 * 问题：前端代码中写死 API 地址（如 '/api/posts/'）会导致：
 *   - 本地开发：需要代理转发到后端（复杂）
 *   - 生产环境：Vercel 部署后无法访问你的后端服务器
 *
 * 解决：用环境变量动态配置 API 基址
 *   - 开发环境：http://localhost:8000
 *   - 生产环境：https://api.wangshixin.me
 *
 * ============================================================
 * 📚 核心概念解释
 * ============================================================
 *
 * 1. import.meta.env
 *    - Vite 提供的环境变量访问方式（Vite 是你的前端构建工具）
 *    - 类似 Node.js 的 process.env，但专为浏览器优化
 *    - 只能读取以 VITE_ 开头的环境变量（安全机制，防止泄露敏感信息）
 *
 * 2. VITE_API_BASE_URL
 *    - 自定义的环境变量名（你可以随意命名，但必须以 VITE_ 开头）
 *    - 在 .env 文件中定义，构建时会自动替换
 *
 * 3. || 'http://localhost:8000'
 *    - 逻辑或运算符：如果左边为空（undefined/null/''），则使用右边的默认值
 *    - 防御性编程：即使忘记设置环境变量，也不会报错
 *
 * 4. /api 后缀
 *    - 统一添加 /api 前缀，避免每次调用都写一遍
 *    - 后端所有接口都在 /api 路径下（/api/posts/、/api/health/ 等）
 *
 * ============================================================
 */

/**
 * API 基础地址
 *
 * 读取顺序：
 * 1. 优先从环境变量 VITE_API_BASE_URL 读取
 * 2. 如果未设置，使用默认值 http://localhost:8000（本地开发）
 *
 * 示例值：
 * - 本地开发：http://localhost:8000
 * - 生产环境：https://api.wangshixin.me
 */
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * 完整的 API 路径
 *
 * 拼接规则：基础地址 + /api
 *
 * 本地开发：http://localhost:8000/api
 * 生产环境：https://api.wangshixin.me/api
 */
export const API_URL = `${API_BASE_URL}/api`;

/**
 * ============================================================
 * 🔍 使用示例
 * ============================================================
 *
 * 在组件中导入：
 * import { API_URL } from '@/config/api';
 *
 * 发送请求：
 * // ❌ 旧写法（写死路径）
 * axios.get('/api/posts/');
 *
 * // ✅ 新写法（动态配置）
 * axios.get(`${API_URL}/posts/`);
 *
 * 实际请求地址：
 * - 本地：http://localhost:8000/api/posts/
 * - 生产：https://api.wangshixin.me/api/posts/
 *
 * ============================================================
 * 📝 环境变量配置方法
 * ============================================================
 *
 * 1. 本地开发（.env.development）：
 *    VITE_API_BASE_URL=http://localhost:8000
 *
 * 2. 生产环境（.env.production）：
 *    VITE_API_BASE_URL=https://api.wangshixin.me
 *
 * 3. Vercel 部署：
 *    在 Vercel Dashboard → Settings → Environment Variables
 *    Name: VITE_API_BASE_URL
 *    Value: https://api.wangshixin.me
 *
 * ============================================================
 */
