// ============================================================
// Markdown 渲染组件
// ============================================================
// 统一项目中所有 Markdown 内容的渲染风格
// 包含：marked 解析、DOMPurify 消毒、Tailwind prose 样式
// ============================================================

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked 支持 ==高亮== 语法
marked.use({
    extensions: [{
        name: 'highlight',
        level: 'inline',
        start(src: string) { return src.match(/==/)?.index; },
        tokenizer(src: string) {
            const rule = /^==([^=]+)==/;
            const match = rule.exec(src);
            if (match) {
                return {
                    type: 'highlight',
                    raw: match[0],
                    text: match[1].trim()
                };
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderer(token: any) {
            return `<mark>${token.text}</mark>`;
        }
    }]
});

interface MarkdownRendererProps {
    /** Markdown 源内容 */
    content: string;
    /** 额外的 CSS 类名 */
    className?: string;
}

/**
 * Markdown 渲染器组件
 * 将 Markdown 内容转换为安全的 HTML 并使用统一的 prose 样式渲染
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        const parseMarkdown = async () => {
            if (!content) {
                setHtmlContent('');
                return;
            }

            // 转换 Markdown 为 HTML
            const rawHtml = await marked.parse(content);
            // 使用 DOMPurify 消毒，防止 XSS 攻击
            const cleanHtml = DOMPurify.sanitize(rawHtml);
            setHtmlContent(cleanHtml);
        };

        parseMarkdown();
    }, [content]);

    if (!htmlContent) {
        return null;
    }

    return (
        <div
            className={`
                prose prose-lg dark:prose-invert max-w-none
                
                /* 标题样式 */
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-h1:text-3xl prose-h1:font-bold prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-2
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8
                prose-h3:text-xl prose-h3:font-semibold
                
                /* 段落和文字 */
                prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-em:text-gray-700 dark:prose-em:text-gray-300
                
                /* 链接 */
                prose-a:text-blue-600 dark:prose-a:text-blue-400 
                prose-a:no-underline hover:prose-a:underline
                
                /* 列表 */
                prose-li:text-gray-600 dark:prose-li:text-gray-400
                prose-li:marker:text-gray-400 dark:prose-li:marker:text-gray-500
                
                /* 代码块 */
                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 
                prose-pre:text-gray-100 prose-pre:rounded-lg
                prose-pre:border prose-pre:border-gray-700
                
                /* 行内代码 */
                prose-code:text-pink-600 dark:prose-code:text-orange-400
                prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-code:before:content-none prose-code:after:content-none
                prose-code:font-normal
                
                /* 代码块内的 code 标签重置样式 */
                [&_pre_code]:text-gray-100 [&_pre_code]:bg-transparent 
                [&_pre_code]:p-0 [&_pre_code]:rounded-none
                
                /* 引用块 */
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50
                prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                prose-blockquote:not-italic prose-blockquote:py-1
                
                /* 分隔线 */
                prose-hr:border-gray-200 dark:prose-hr:border-gray-700
                
                /* 表格 */
                prose-table:border-collapse
                prose-th:bg-gray-100 dark:prose-th:bg-gray-800
                prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:px-4 prose-th:py-2
                prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:px-4 prose-td:py-2
                
                /* 图片 */
                prose-img:rounded-lg prose-img:shadow-md
                
                /* 高亮标记 */
                [&_mark]:bg-yellow-200 dark:[&_mark]:bg-yellow-500/30 
                [&_mark]:text-gray-900 dark:[&_mark]:text-yellow-100
                [&_mark]:px-1 [&_mark]:rounded
                
                ${className}
            `.replace(/\s+/g, ' ').trim()}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
