// src/pages/Post.tsx
// 博客文章详情页面

import { useEffect, useState } from 'react';
import type { Post } from '../types';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config/api';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function Post() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            try {
                const response = await axios.get<Post>(`${API_URL}/posts/${slug}/`);
                setPost(response.data);
            } catch (error) {
                console.error('获取文章详情失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) return <div>加载中...</div>;
    if (!post) return <div>文章未找到</div>;

    return (
        <article className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            {/* Post Author and Dates */}
            <div className="text-sm text-gray-500 mb-6">
                作者：{post.author.username} · 发布于 {new Date(post.created_at).toLocaleDateString()}
                {post.updated_at &&
                    new Date(post.created_at).toDateString() != new Date(post.updated_at).toDateString() && (
                        <> · 最后更新于 {new Date(post.updated_at).toLocaleDateString()}</>
                    )}
            </div>

            {/* Post Category and Tags */}
            <div className="flex flex-wrap gap-2 mt-4 text-sm">
                {post.category && (
                    <a
                        href={`/category/${post.category.id}`}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:underline"
                    >
                        {post.category.name}
                    </a>
                )}
                {post.tags.map(tag => (
                    <a
                        key={tag.id}
                        href={`/tag/${tag.id}`}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:underline"
                    >
                        {tag.name}
                    </a>
                ))}
            </div>

            {/* Post Detail - 使用统一的 Markdown 渲染组件 */}
            <MarkdownRenderer content={post.content || ''} className="mt-6" />
        </article>
    );
}