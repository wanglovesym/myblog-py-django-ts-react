import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post } from '../types';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function Blog() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>(`${API_URL}/posts/`);
                setPosts(response.data);
            } catch (error) {
                console.error('获取文章列表失败:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchPosts();
    }, []);

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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">博客</h1>
                <p className="text-gray-600 dark:text-gray-400">分享技术见解与生活感悟</p>
            </div>

            <div className="space-y-6">
                {posts.map(post => (
                    <article key={post.id} className="group">
                        <Link
                            to={`/post/${post.slug}`}
                            className="block p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700
                                     hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
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
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    暂无文章
                </div>
            )}
        </div>
    );
}
