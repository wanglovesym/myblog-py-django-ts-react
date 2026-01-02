import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get<Project>(`${API_URL}/projects/${slug}/`);
                setProject(response.data);
            } catch (err) {
                console.error('获取项目详情失败:', err);
                setError('项目不存在或加载失败');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProject();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-gray-600 dark:text-gray-400">{error || '项目不存在'}</div>
                <Link
                    to="/projects"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    ← 返回项目列表
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* 返回链接 */}
            <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回项目列表
            </Link>

            {/* 封面图 */}
            {project.cover_image_url && (
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* 项目信息头部 */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* 精选标记 */}
                    {project.is_featured && (
                        <span className="px-3 py-1 text-sm font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                            ✨ 精选项目
                        </span>
                    )}
                    {/* 状态标签 */}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[project.status] || statusColors.offline}`}>
                        {project.status_display}
                    </span>
                </div>

                {/* 标题 */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                </h1>

                {/* 描述 */}
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    {project.description}
                </p>

                {/* 时间信息 */}
                <div className="text-sm text-gray-500 dark:text-gray-500">
                    <time>创建于 {new Date(project.created_at).toLocaleDateString('zh-CN')}</time>
                    {project.updated_at && (
                        <time className="ml-4">更新于 {new Date(project.updated_at).toLocaleDateString('zh-CN')}</time>
                    )}
                </div>

                {/* 技术栈 */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map(tech => (
                            <a
                                key={tech.id}
                                href={tech.official_url || '#'}
                                target={tech.official_url ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-white/10 dark:bg-slate-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-slate-700/50 transition"
                                style={tech.color ? { borderLeft: `4px solid ${tech.color}` } : undefined}
                            >
                                {tech.icon_url && (
                                    <img src={tech.icon_url} alt={tech.name} className="w-4 h-4" />
                                )}
                                {tech.name}
                            </a>
                        ))}
                    </div>
                )}

                {/* 链接按钮 */}
                <div className="flex gap-4 pt-2">
                    {project.github_url && (
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-lg
                                     bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            查看源码
                        </a>
                    )}
                    {project.demo_url && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-lg
                                     bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            在线演示
                        </a>
                    )}
                </div>
            </div>

            {/* 详细内容 */}
            {project.content && (
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">项目详情</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none
                                  prose-headings:text-gray-900 dark:prose-headings:text-white
                                  prose-p:text-gray-600 dark:prose-p:text-gray-400
                                  prose-a:text-blue-600 dark:prose-a:text-blue-400
                                  prose-code:text-pink-600 dark:prose-code:text-pink-400
                                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800">
                        {/* 简单文本渲染，后续可以替换为 Markdown 渲染器 */}
                        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                            {project.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
