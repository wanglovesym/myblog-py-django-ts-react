import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Post, Category } from "../types";

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
                // 获取类型名称
                const categoryRes = await axios.get<Category>(`/api/categories/${categoryId}`)
                setCategoryName(categoryRes.data.name);

                // 获取类型下所有文章
                // const PostRes = await axios.get<Post[]>(`/api/posts/?category=${categoryId}`);
                const postsRes = await axios.get<Post[]>('/api/posts/', {
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
                                className="text-blue-600 hover:underline"
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