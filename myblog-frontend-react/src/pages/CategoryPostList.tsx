import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import type { Post, Category } from "../types";
// 引入 API 配置：统一管理后端地址
import { API_URL } from '../config/api';

export default function CategoryPostList() {
    // const { id: categoryId } = useParams<{ id: string }>();
    const categoryId = useParams<{ id: string }>().id;
    const [posts, setPosts] = useState<Post[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!categoryId) return;

        const fetchPostByCategory = async () => {
            try {
                // 获取类型名称（使用动态 API 地址）
                const categoryRes = await axios.get<Category>(`${API_URL}/categories/${categoryId}`)
                setCategoryName(categoryRes.data.name);

                // 获取类型下所有文章
                // params 会自动拼接成 ?category=1 这样的查询参数
                const postsRes = await axios.get<Post[]>(`${API_URL}/posts/`, {
                    params: { category: categoryId },
                })
                setPosts(postsRes.data);

            } catch (error) {
                console.error("获取分类下文章失败:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPostByCategory();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">分类</h1>
                <p className="text-gray-600 dark:text-gray-400">分类：“{categoryName}”{posts.length ? ` · 共 ${posts.length} 篇` : ''}</p>
            </div>

            <div className="space-y-6">
                {posts.map(post => (
                    <article key={post.id} className="group">
                        <Link
                            to={`/post/${post.slug}`}
                            className="block p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#b5ecfd] dark:hover:border-[#b5ecfd] hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#b5ecfd] dark:group-hover:text-[#b5ecfd] transition">
                                        {post.title}
                                    </h2>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {post.summary}
                                    </p>
                                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                        <span>{post.author.username}</span>
                                        <span>·</span>
                                        <time>{new Date(post.created_at).toLocaleDateString('zh-CN')}</time>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">该分类暂无文章</div>
            )}
        </div>
    );
}