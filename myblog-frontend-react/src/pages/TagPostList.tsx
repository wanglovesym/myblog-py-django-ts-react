import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import type { Post, Tag } from "../types";
// 引入 API 配置：统一管理后端地址
import { API_URL } from '../config/api';

// TODO: 报错获取文章列表失败
export default function TagPostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [tagName, setTagName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const tagId = useParams<{ id: string }>().id;

    useEffect(() => {
        if (!tagId) return;

        const fetchPostsByTag = async () => {
            try {
                // 获取 Tag 名字（使用动态 API 地址）
                const tagNameRes = await axios.get<Tag>(`${API_URL}/tags/${tagId}`);
                setTagName(tagNameRes.data.name);

                // 获取所属 tag 的文章列表
                const postRes = await axios.get<Post[]>(`${API_URL}/posts/`, {
                    params: {
                        tags: tagId,
                    }
                })
                setPosts(postRes.data);
            } catch (error) {
                console.log("获取标签下文章失败:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPostsByTag();
    }, [tagId])

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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">标签</h1>
                <p className="text-gray-600 dark:text-gray-400">标签：“{tagName}”{posts.length ? ` · 共 ${posts.length} 篇` : ''}</p>
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
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">该标签暂无文章</div>
            )}
        </div>
    );
}