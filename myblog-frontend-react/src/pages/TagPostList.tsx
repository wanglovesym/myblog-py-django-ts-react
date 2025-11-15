import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { Post, Tag } from "../types";

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
                // 获取 Tag 名字
                const tagNameRes = await axios.get<Tag>(`/api/tags/${tagId}`);
                setTagName(tagNameRes.data.name);

                // 获取所属 tag 的文章列表
                const postRes = await axios.get<Post[]>('/api/posts/', {
                    params: {
                        tag: tagId,
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

    if (loading) return <div>加载中...</div>

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                标签：{tagName}
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