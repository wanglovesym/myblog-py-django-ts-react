// ================================================
// 定义前端 TypeScript 使用的类型接口
// 与后端 Django REST Framework 的 Serializer 对应
// 注意：前端接口必须与后端 Serializer 严格对齐，否则类型检查会失败
// =================================================

/**
 * 定义文章作者的接口
 * username 与后端author所使用的模型User的username字段对应
 * 为什么单独定义？
 * 后端API返回的格式是User对象，username是其中一个字段，所以此处也要定义一个User对象接口
 * 复用性高（未来评论、用户页都可用）。
 */
export interface User {
    username: string;
    email?: string;
    id?: number;
}

/**
 * 定义从后端 API 获取的分类对象结构。
 */
export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Tag {
    id: number;
    name: string;
}

/**
 * 定义从后端 API 获取的文章对象结构。
 * '?' 表示可选字段（仅详情页返回，列表页没有）
 * created_at: string
 *      Django 返回 ISO 8601 字符串（如 "2025-11-09T11:08:23.579107Z"）
 *      前端用 new Date(post.created_at) 转为 JS 日期对象
 * 前端接口必须与后端 Serializer 严格对齐，否则类型检查会失败
 */
export interface Post {
    id: number;
    title: string;
    author: User;
    slug: string;
    summary: string;
    content?: string;
    created_at: string;
    updated_at?: string;
    category: Category | null; // 分类可为空
    tags: Tag[]; // 标签可有多个
}
