import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post } from '../types';
import axios from 'axios';
import { API_URL } from '../config/api';
import { SOCIAL } from '../config/social';

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [typedText, setTypedText] = useState<string>('');
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const motto = 'BE PATIENT WITH YOUR GROWTH';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>(`${API_URL}/posts/`);
                // 只显示最新的3篇文章
                setPosts(response.data.slice(0, 3));
            } catch (error) {
                console.error('获取文章列表失败:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchPosts();
    }, []);

    // 打字机效果
    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= motto.length) {
                setTypedText(motto.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setShowCursor(false); // 打字完成后隐藏光标
            }
        }, 100); // 每100ms打印一个字符

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <div className="space-y-16">
            {/* About 区块 - 居中设计 */}
            <section className="space-y-8">
                <div className="flex flex-col items-center text-center">
                    {/* 头像 */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
                        <img
                            src="/avatar.jpg"
                            alt="雨影"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>

                    {/* 名字 */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        雨影
                    </h1>

                    {/* 座右铭 - 打字机效果 */}
                    <h2 className="text-base sm:text-lg font-normal text-gray-700 dark:text-gray-300 tracking-wider mb-4 min-h-[1.5rem] sm:min-h-[1.75rem]">
                        {typedText}
                        {showCursor && <span className="animate-pulse">|</span>}
                    </h2>

                    {/* 社交图标 */}
                    <div className="flex items-center gap-4">
                        {/* GitHub */}
                        <a
                            href={SOCIAL.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 
                                     hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white 
                                     transition-all transform hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.35.73-4.06-1.62-4.06-1.62-.55-1.4-1.35-1.77-1.35-1.77-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.84 1.32 3.53 1.01.11-.79.42-1.32.76-1.62-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 6.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.24 0 4.64-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.21v3.28c0 .32.22.7.82.58A12 12 0 0 0 12 .5z" />
                            </svg>
                        </a>

                        {/* CSDN */}
                        <a
                            href={SOCIAL.csdn}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="CSDN"
                            className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 
                                     hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white 
                                     transition-all transform hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5.5 4h13c.825 0 1.5.675 1.5 1.5v13c0 .825-.675 1.5-1.5 1.5h-13c-.825 0-1.5-.675-1.5-1.5v-13C4 4.675 4.675 4 5.5 4zm1.5 3v2h2V7H7zm0 3v2h2v-2H7zm0 3v2h2v-2H7zm3-6v2h6V7h-6zm0 3v2h6v-2h-6zm0 3v2h6v-2h-6z" />
                            </svg>
                        </a>

                        {/* 稀土掘金 */}
                        <a
                            href={SOCIAL.juejin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="稀土掘金"
                            className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 
                                     hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white 
                                     transition-all transform hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 12l2.5 2.5L12 7l7.5 7.5L22 12 12 2zm0 5L7 12l5 5 5-5-5-5z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href={SOCIAL.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 
                                     hover:bg-blue-700 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white 
                                     transition-all transform hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Posts 区块 */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">最新文章</h2>
                    <Link
                        to="/blog"
                        className="text-gray-600 dark:text-gray-400 hover:text-[#b5ecfd] dark:hover:text-[#b5ecfd] hover:underline text-sm font-medium transition-colors"
                    >
                        查看全部 →
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">加载中...</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <Link
                                key={post.id}
                                to={`/post/${post.slug}`}
                                className="block group"
                            >
                                <article className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-3 text-sm text-gray-500 dark:text-gray-500 mb-1">
                                            <time>{new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#b5ecfd] dark:group-hover:text-[#b5ecfd] transition">
                                            {post.title}
                                        </h3>
                                        {post.summary && (
                                            <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
                                                {post.summary}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Projects 区块 */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">项目</h2>
                    <Link
                        to="/projects"
                        className="text-gray-600 dark:text-gray-400 hover:text-[#b5ecfd] dark:hover:text-[#b5ecfd] hover:underline text-sm font-medium transition-colors"
                    >
                        查看全部 →
                    </Link>
                </div>

                <div className="p-8 text-center bg-gray-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <div className="space-y-3">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <div>
                            <p className="text-gray-900 dark:text-white font-medium">Coming Soon!</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                此板块正在配置中，敬请期待...
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}