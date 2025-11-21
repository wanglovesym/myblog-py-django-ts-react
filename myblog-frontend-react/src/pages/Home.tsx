/**
 * useEffect: 用于在组件挂载时自动调用 API（类似 Vue 的 onMounted）
 * 
 */
import { useEffect, useState } from "react";
import type { Post } from '../types';
import axios from 'axios';
import CategoryList from "../components/CategoryList";
import TagList from "../components/TagList";

// export: 将函数、变量、类等导出，供其他文件导入（import）使用。
// export default：一个文件只能有一个 default 导出，导入时可自定义名字。
//      example: import HP from './HomePage'; 会导入HomePage function。
export default function Home() {
    // [当前variable, 更新用function]
    // 例子：
    // import { useState } from 'react';

    // function Counter() {
    //   const [count, setCount] = useState(0); // 初始值为 0

    //   return (
    //     <div>
    //       <p>当前计数：{count}</p>
    //       <button onClick={() => setCount(count + 1)}>
    //         +1
    //       </button>
    //     </div>
    //   );
    // }
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect: 组件挂载后执行副作用操作（如数据获取）
    // 就是在组件加载时调用 API 获取文章列表
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                /**
                 * axios:
                 * 一个流行的 HTTP 客户端库，用于发送请求（GET/POST 等）。
                 * 比原生 fetch 更强大：自动 JSON 转换、拦截器、类型支持等。
                 * .get<Post[]>: 指定响应数据类型为 Post 数组，启用类型检查。
                 */
                const response = await axios.get<Post[]>('/api/posts/'); // res.data 类型：Post[]
                setPosts(response.data);
            } catch (error) {
                console.error('获取文章列表失败:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchPosts();
    }, []); // 空数组表示只在组件挂载时（首次渲染时）执行一次

    // 定义加载中显示什么
    if (loading) {
        return <div>加载中...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">我的博客</h1>
            <div className="space-y-4">
                {posts.map(post => (
                    <article key={post.id} className="border-b pb-4">
                        <h2 className="text-xl font-semibold">
                            <a href={`/post/${post.slug}`} className="text-blue-600 hover:underline">
                                {post.title}
                            </a>
                        </h2>
                        <p className="text-gray-600 mt-2">{post.summary}</p>
                        <div className="text-sm text-gray-500 mt-2">
                            作者：{post.author.username} · 发布于 {new Date(post.created_at).toLocaleDateString()}
                        </div>
                    </article>
                ))}
            </div>
            {/* 类别和标签列表 */}
            <div className="space-y-6">
                <CategoryList />
                <TagList />
            </div>
        </div>
    );
}