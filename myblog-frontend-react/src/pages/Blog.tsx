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
                            className="block p-6 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-sm
                                     hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-md hover:ring-1 hover:ring-white/20 dark:hover:ring-white/10 transition-all"
                        >
                            <div className="space-y-2">
                                {/* 行1：发布日期与修改日期（小字） */}
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <time className="mr-2">发布于 {new Date(post.created_at).toLocaleDateString('zh-CN')}</time>
                                    {post.updated_at && (
                                        <time>· 修改于 {new Date(post.updated_at).toLocaleDateString('zh-CN')}</time>
                                    )}
                                </div>

                                {/* 行2：类别 + 标题 */}
                                <div className="flex items-baseline gap-2">
                                    {post.category && (
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.category.name}</span>
                                    )}
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#b5ecfd] dark:group-hover:text-[#b5ecfd] transition">
                                        {post.title}
                                    </h2>
                                </div>

                                {/* 行3：摘要（最多两行省略） */}
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {post.summary}
                                </p>

                                {/* 行4：作者（小字） */}
                                <div className="text-xs text-gray-500 dark:text-gray-500">作者：{post.author.username}</div>

                                {/* 行5：标签 */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {post.tags.map(tag => (
                                            <span key={tag.id} className="text-xs px-2 py-1 rounded-full text-gray-700 dark:text-gray-300 bg-white/5 dark:bg-slate-700/30">
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
