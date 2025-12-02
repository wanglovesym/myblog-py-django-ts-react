import { useState, useEffect } from 'react';
// 用于获取 URL 中的 ?q=xxx 参数
// 返回值：一个类似 [URLSearchParams, setSearchParams] 的数组
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { Post } from '../types'
// 引入 API 配置：统一管理后端地址
import { API_URL } from '../config/api';

export default function SearchResult() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchParams] = useSearchParams();
    /**
     * 作用：从查询参数中提取关键词 q，若不存在则默认为空字符串
     * 为什么是.get('q')?
     * 获取q的值
     * url设定是/search?q=博客，这样就会返回q的值：博客
     */
    const query = searchParams.get('q') || '';

    useEffect(() => {
        /**
         * 作用：若搜索词为空，直接清空结果并结束
         * 避免无意义的 API 请求（/api/posts/?search= 会返回所有文章）
         */
        if (!query) {
            setPosts([]);
            setLoading(true);
            return
        }

        const fetchSearchResults = async () => {
            try {
                /**
                 * 发送Get请求到后端搜索接口
                 * 自动附加查询参数: ?search=关键词
                 * 泛型 <Post[]> 告诉Typescript响应数据类型
                 * 
                 * 使用 API_URL 确保在不同环境下都能正确访问：
                 * - 开发：http://localhost:8000/api/posts/?search=xxx
                 * - 生产：https://api.wangshixin.me/api/posts/?search=xxx
                 */
                const response = await axios.get<Post[]>(`${API_URL}/posts/`, {
                    params: { search: query },
                });
                setPosts(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error('搜索失败', error);
                setPosts([])
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]); // query是依赖数组，作用在query改变时，重新执行搜索逻辑

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-600 dark:text-gray-400">搜索中...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">搜索结果</h1>
                <p className="text-gray-600 dark:text-gray-400">关键字：“{query}”{posts.length ? ` · 共 ${posts.length} 篇` : ''}</p>
            </div>

            <div className="space-y-6">
                {posts.map(post => (
                    <article key={post.id} className="group">
                        <Link
                            to={`/post/${post.slug}`}
                            className="block p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700
                                     hover:border-[#b5ecfd] dark:hover:border-[#b5ecfd] hover:shadow-md transition-all"
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
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    没有找到相关文章。
                </div>
            )}
        </div>
    );
}

/**
 * 工作流程：
 * 用户在 Header 输入“博客” → 跳转到 /search?q=博客
 * SearchResultPage 组件挂载
 * useSearchParams() 获取 q=博客
 * useEffect 触发 → 调用 /api/posts/?search=博客
 * 后端返回匹配文章列表
 * 前端渲染结果（含作者名 post.author.username）
 */