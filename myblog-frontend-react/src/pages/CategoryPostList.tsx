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
                            className="block p-6 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-sm
                                     hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-md hover:ring-1 hover:ring-white/20 dark:hover:ring-white/10 transition-all"
                        >
                            <div className="space-y-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <time className="mr-2">发布于 {new Date(post.created_at).toLocaleDateString('zh-CN')}</time>
                                    {post.updated_at && (
                                        <time>· 修改于 {new Date(post.updated_at).toLocaleDateString('zh-CN')}</time>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-2">
                                    {post.category && (
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.category.name}</span>
                                    )}
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#b5ecfd] dark:group-hover:text-[#b5ecfd] transition">
                                        {post.title}
                                    </h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {post.summary}
                                </p>
                                <div className="text-xs text-gray-500 dark:text-gray-500">作者：{post.author.username}</div>
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {post.tags.map(tag => (
                                            <span key={tag.id} className="text-xs px-2 py-1 rounded-full text-gray-700 dark:text-gray-300 bg-white/5 dark:bg-slate-700/30">#{tag.name}</span>
                                        ))}
                                    </div>
                                )}
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