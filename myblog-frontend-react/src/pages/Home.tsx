import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post, Project } from '../types';
import axios from 'axios';
import { API_URL } from '../config/api';
import { SOCIAL } from '../config/social';
import githubIcon from '../assets/icons/github.png';
import csdnIcon from '../assets/icons/csdn.png';
import juejinIcon from '../assets/icons/juejin.png';
import linkedinIcon from '../assets/icons/linkedin.png';
import neteasemusicIcon from '../assets/icons/neteasemusic.png';

// 状态标签颜色映射
const statusColors: Record<string, string> = {
    developing: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    completed: 'bg-green-500/20 text-green-600 dark:text-green-400',
    online: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    offline: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
};

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
    const [typedText, setTypedText] = useState<string>('');
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const motto = 'BE PATIENT WITH YOUR GROWTH';

    // 每页显示的项目数量
    const projectsPerPage = 2;

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

        const fetchProjects = async () => {
            try {
                // 获取精选项目，最多显示6个
                const response = await axios.get<Project[]>(`${API_URL}/projects/?featured=true`);
                setProjects(response.data.slice(0, 6));
            } catch (error) {
                console.error('获取项目列表失败:', error);
            } finally {
                setProjectsLoading(false);
            }
        };

        fetchPosts();
        fetchProjects();
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

    // 轮播控制函数
    const totalSlides = Math.ceil(projects.length / projectsPerPage);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    const goToSlide = (index: number) => setCurrentSlide(index);

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
                            <img src={githubIcon} alt="GitHub" className="w-6 h-6" />
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
                            <img src={csdnIcon} alt="CSDN" className="w-6 h-6" />
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
                            <img src={juejinIcon} alt="稀土掘金" className="w-6 h-6" />
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
                            <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" />
                        </a>

                        {/* 网易云音乐 */}
                        <a
                            href={SOCIAL.neteasemusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="网易云音乐"
                            className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 
                                     hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white 
                                     transition-all transform hover:scale-110"
                        >
                            <img src={neteasemusicIcon} alt="网易云音乐" className="w-6 h-6" />
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">精选项目</h2>
                    <Link
                        to="/projects"
                        className="text-gray-600 dark:text-gray-400 hover:text-[#b5ecfd] dark:hover:text-[#b5ecfd] hover:underline text-sm font-medium transition-colors"
                    >
                        查看全部 →
                    </Link>
                </div>

                {projectsLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">加载中...</div>
                    </div>
                ) : projects.length > 0 ? (
                    <div className="relative">
                        {/* 轮播容器 */}
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {/* 每一页为一个完整宽度的容器 */}
                                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                    <div
                                        key={slideIndex}
                                        className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        {projects.slice(slideIndex * projectsPerPage, slideIndex * projectsPerPage + projectsPerPage).map(project => (
                                            <Link
                                                key={project.id}
                                                to={`/project/${project.slug}`}
                                                className="group block h-full"
                                            >
                                                <article className="h-full flex flex-col rounded-xl overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-sm
                                                              hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-lg hover:ring-1 hover:ring-white/20 dark:hover:ring-white/10 transition-all">
                                                    {/* 封面图 - 固定高度 */}
                                                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                                        {project.cover_image_url ? (
                                                            <img
                                                                src={project.cover_image_url}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <svg
                                                                    className="w-12 h-12 text-gray-400 dark:text-gray-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.5}
                                                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 项目信息 - 固定高度 */}
                                                    <div className="p-4 flex flex-col flex-grow" style={{ minHeight: '160px' }}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[project.status] || statusColors.offline}`}>
                                                                {project.status_display}
                                                            </span>
                                                            {project.is_featured && (
                                                                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                                                                    ✨ 精选
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#b5ecfd] dark:group-hover:text-[#b5ecfd] transition line-clamp-1 mb-2">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
                                                            {project.description}
                                                        </p>
                                                        {/* 技术栈 - 固定在底部 */}
                                                        <div className="flex flex-wrap gap-1 pt-2 mt-auto h-8 overflow-hidden">
                                                            {project.tech_stack && project.tech_stack.slice(0, 4).map(tech => (
                                                                <span
                                                                    key={tech.id}
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-white/10 dark:bg-slate-700/30 text-gray-600 dark:text-gray-400"
                                                                >
                                                                    {tech.name}
                                                                </span>
                                                            ))}
                                                            {project.tech_stack && project.tech_stack.length > 4 && (
                                                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                                                    +{project.tech_stack.length - 4}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 轮播控制 - 仅当有多页时显示 */}
                        {totalSlides > 1 && (
                            <>
                                {/* 左右箭头 */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6
                                             w-10 h-10 flex items-center justify-center rounded-full
                                             bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm
                                             text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700
                                             transition-all hover:scale-110"
                                    aria-label="上一页"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6
                                             w-10 h-10 flex items-center justify-center rounded-full
                                             bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm
                                             text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700
                                             transition-all hover:scale-110"
                                    aria-label="下一页"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* 指示器圆点 */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {Array.from({ length: totalSlides }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === index
                                                    ? 'bg-blue-600 dark:bg-blue-400 w-6'
                                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                                }`}
                                            aria-label={`转到第 ${index + 1} 页`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-gray-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <div className="space-y-3">
                            <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <div>
                                <p className="text-gray-900 dark:text-white font-medium">暂无精选项目</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    精选项目将在这里展示
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}