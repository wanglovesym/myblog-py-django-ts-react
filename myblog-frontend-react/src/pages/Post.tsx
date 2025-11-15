// src/pages/PostPage.tsx

import { useEffect, useState } from 'react';
import type { Post } from '../types';
import axios from 'axios';
// useParams: 从路由参数中提取动态部分（如 :slug）
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function Post() {
    // 用于请求 /api/posts/${slug}/
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            try {
                const response = await axios.get<Post>(`/api/posts/${slug}/`);
                const postData = response.data;
                setPost(response.data);

                // 转换 Markdown 为 HTML 并进行消毒
                const rawHtml = await marked.parse(postData.content || '');
                const cleanHtml = DOMPurify.sanitize(rawHtml);
                setHtmlContent(cleanHtml);
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
            <div className="text-sm text-gray-500 mb-6">
                作者：{post.author.username} · 发布于 {new Date(post.created_at).toLocaleDateString()}
                {post.updated_at &&
                    new Date(post.created_at).toDateString() != new Date(post.updated_at).toDateString() && (
                        <> · 最后更新于 {new Date(post.updated_at).toLocaleDateString()}</>
                    )}
            </div>
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
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }} // 使用预渲染的 HTML
            />
        </article>
    );
}