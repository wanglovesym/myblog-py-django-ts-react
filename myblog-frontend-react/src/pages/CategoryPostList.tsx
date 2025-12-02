import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

    if (loading) return <div>加载中...</div>

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                分类：{categoryName}
            </h2>
            <div className="space-y-4">
                {posts.map(post => (
                    <article key={post.id} className="border-b pb-4">
                        <h3 className="text-lg font-medium">
                            <a
                                href={`/post/${post.slug}`}
                                className="text-gray-900 dark:text-white hover:text-[#b5ecfd] dark:hover:text-[#b5ecfd] transition-colors"
                            >
                                {post.title}
                            </a>
                        </h3>
                        <p className="text-gray-600 mt-1">{post.summary}</p>
                        <div className="text-sm text-gray-500 mt-2">
                            作者：{post.author.username} · 发布于{' '}
                            {new Date(post.created_at).toLocaleDateString()}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}