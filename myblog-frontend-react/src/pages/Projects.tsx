import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Project } from '../types';
import axios from 'axios';
import { API_URL } from '../config/api';

// 状态标签颜色映射
const statusColors: Record<string, string> = {
    developing: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    completed: 'bg-green-500/20 text-green-600 dark:text-green-400',
    online: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    offline: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const url = showFeaturedOnly
                    ? `${API_URL}/projects/?featured=true`
                    : `${API_URL}/projects/`;
                const response = await axios.get<Project[]>(url);
                setProjects(response.data);
            } catch (error) {
                console.error('获取项目列表失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [showFeaturedOnly]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 页面标题 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">项目</h1>
                    <p className="text-gray-600 dark:text-gray-400">我的开源项目与作品集</p>
                </div>

                {/* 精选筛选 */}
                <button
                    onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showFeaturedOnly
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white/10 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                >
                    {showFeaturedOnly ? '✨ 仅显示精选' : '显示全部'}
                </button>
            </div>

            {/* 项目网格 */}
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map(project => (
                        <article
                            key={project.id}
                            className="group relative rounded-xl overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-sm
                                     hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-lg hover:ring-1 hover:ring-white/20 dark:hover:ring-white/10 transition-all"
                        >
                            {/* 精选标记 */}
                            {project.is_featured && (
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                                        ✨ 精选
                                    </span>
                                </div>
                            )}

                            {/* 封面图 */}
                            <Link to={`/project/${project.slug}`}>
                                <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                    {project.cover_image_url ? (
                                        <img
                                            src={project.cover_image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg
                                                className="w-16 h-16 text-gray-400 dark:text-gray-600"
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
                            </Link>

                            {/* 项目信息 */}
                            <div className="p-5 space-y-3">
                                {/* 状态标签 */}
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[project.status] || statusColors.offline}`}>
                                        {project.status_display}
                                    </span>
                                </div>

                                {/* 标题 */}
                                <Link to={`/project/${project.slug}`}>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#b5ecfd] dark:group-hover:text-[#b5ecfd] transition">
                                        {project.title}
                                    </h2>
                                </Link>

                                {/* 描述 */}
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                    {project.description}
                                </p>

                                {/* 技术栈 */}
                                {project.tech_stack && project.tech_stack.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack.map(tech => (
                                            <span
                                                key={tech.id}
                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-white/10 dark:bg-slate-700/30 text-gray-700 dark:text-gray-300"
                                                style={tech.color ? { borderLeft: `3px solid ${tech.color}` } : undefined}
                                            >
                                                {tech.icon_url && (
                                                    <img src={tech.icon_url} alt={tech.name} className="w-3 h-3" />
                                                )}
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* 链接按钮 */}
                                <div className="flex gap-3 pt-2">
                                    {project.github_url && (
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                                                     bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            GitHub
                                        </a>
                                    )}
                                    {project.demo_url && (
                                        <a
                                            href={project.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                                                     bg-blue-600 text-white hover:bg-blue-700 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            演示
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {showFeaturedOnly ? '暂无精选项目' : '暂无项目'}
                </div>
            )}
        </div>
    );
}
