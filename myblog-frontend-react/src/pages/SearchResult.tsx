import { useState, useEffect } from 'react';
// 用于获取 URL 中的 ?q=xxx 参数
// 返回值：一个类似 [URLSearchParams, setSearchParams] 的数组
import { useSearchParams } from 'react-router-dom';
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

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                搜索 “{query}” 的结果
            </h2>
            {loading ? ( // 状态loading显示搜索中
                <p>搜索中...</p>
            ) : posts.length > 0 ? ( // 如果找到至少一篇文章
                <div className="space-y-4">
                    {posts.map((post) => (
                        <article key={post.id} className="border-b pb-4">
                            <h3 className="text-lg font-medium">
                                <a
                                    href={`/post/${post.slug}`} //生成详情页链接
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
            ) : ( // 否则显示无结果
                <p>没有找到相关文章。</p>
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