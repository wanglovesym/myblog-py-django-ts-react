import { useEffect, useState } from "react";
// 用于前端路由跳转
import { Link, useNavigate } from "react-router-dom";
// 
import { SOCIAL } from "../config/social";

export default function Header() {
    const [query, setQuery] = useState('');
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
        // 默认模式改为 dark
        return true;
    });
    const [searchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((v) => !v);

    return (
        <header className="flex flex-row items-center justify-end h-14 p-4 sticky bg-[#10182c] ">
            <Link to="/" aria-label="主页" className="mr-auto">
                <h1 className="text-2xl font-bold">
                    <span className="text-blue-600 group-hover:underline">雨影的小站</span>
                </h1>
            </Link>

            {/* 社交图标 + 主题切换 */}
            <div className="flex items-center gap-3 text-slate-500">
                <a href={SOCIAL.github} target="_blank" rel="noopener" aria-label="GitHub" className="hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.35.73-4.06-1.62-4.06-1.62-.55-1.4-1.35-1.77-1.35-1.77-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.84 1.32 3.53 1.01.11-.79.42-1.32.76-1.62-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 6.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.24 0 4.64-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.21v3.28c0 .32.22.7.82.58A12 12 0 0 0 12 .5z" />
                    </svg>
                </a>
                <a href={SOCIAL.discord} target="_blank" rel="noopener" aria-label="Discord" className="hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3c-.203.372-.438.884-.602 1.284a18.185 18.185 0 0 0-7.912 0c-.164-.4-.4-.912-.602-1.284a19.736 19.736 0 0 0-3.76 1.369C1.982 9.022.9 13.417 1.055 17.747a19.922 19.922 0 0 0 5.993 3.056c.48-.659.908-1.36 1.276-2.099-.7-.263-1.365-.595-1.99-.992.167-.12.331-.244.488-.372a13.91 13.91 0 0 0 12.335 0c.159.129.323.252.49.372-.625.397-1.291.729-1.99.992.368.739.796 1.44 1.276 2.099a19.922 19.922 0 0 0 5.993-3.056c.207-5.518-1.776-9.868-4.609-13.378ZM8.02 14.78c-1.183 0-2.146-1.084-2.146-2.418s.957-2.418 2.146-2.418c1.196 0 2.146 1.084 2.146 2.418s-.95 2.418-2.146 2.418Zm7.96 0c-1.183 0-2.146-1.084-2.146-2.418s.957-2.418 2.146-2.418c1.196 0 2.146 1.084 2.146 2.418s-.95 2.418-2.146 2.418Z" />
                    </svg>
                </a>
                <a href={SOCIAL.wechat} target="_blank" rel="noopener" aria-label="WeChat" className="hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M18.5 4.5c2.485 0 4.5 1.79 4.5 4s-2.015 4-4.5 4c-.247 0-.49-.017-.726-.05-.34.21-.8.45-1.274.55.27-.39.5-.88.5-1.45 0-2.21-2.015-4-4.5-4-.63 0-1.23.11-1.776.31C10.217 6.04 11.25 4.5 13.5 4.5c.88 0 1.7.25 2.38.69.785-.45 1.72-.69 2.62-.69Zm-9 5c2.485 0 4.5 1.79 4.5 4s-2.015 4-4.5 4c-.49 0-.97-.07-1.43-.19-.53.29-1.23.62-1.92.78.41-.58.79-1.31.79-2.09C6 15.79 4 14.5 4 12.5s2.015-4 4.5-4Zm7-2.5c.552 0 1 .45 1 1s-.448 1-1 1-1-.45-1-1 .448-1 1-1Zm-9 5.5c.552 0 1 .45 1 1s-.448 1-1 1-1-.45-1-1 .448-1 1-1Z" />
                    </svg>
                </a>
                <a href={SOCIAL.email} aria-label="Email" className="hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M2 6.75A2.75 2.75 0 0 1 4.75 4h14.5A2.75 2.75 0 0 1 22 6.75v10.5A2.75 2.75 0 0 1 19.25 20H4.75A2.75 2.75 0 0 1 2 17.25V6.75Zm3.1.25a.75.75 0 0 0-.5 1.32l7.4 5.55c.57.43 1.42.43 1.99 0l7.4-5.55a.75.75 0 0 0-.5-1.32H5.1Z" />
                    </svg>
                </a>
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "切换到明亮模式" : "切换到暗色模式"}
                    className="ml-1 inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={isDark ? "Light" : "Dark"}
                >
                    {isDark ? (
                        // Sun icon
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path d="M12 4.75a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5ZM12 17.75a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5ZM6.22 6.22a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L6.22 7.28a.75.75 0 0 1 0-1.06Zm9.44 9.44a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM4.75 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 4.75 12Zm12.25-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5ZM6.22 17.78a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 1 1-1.06-1.06l-1.06 1.06a.75.75 0 0 1 0 1.06Zm9.44-9.44a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 1 1-1.06-1.06l-1.06 1.06a.75.75 0 0 1 0 1.06ZM12 7.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Z" />
                        </svg>
                    ) : (
                        // Moon icon
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                        </svg>
                    )}
                </button>
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2">
                {searchOpen && (
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="搜索文章..."
                        className="w-56 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        aria-label="搜索文章"
                        autoFocus
                        onBlur={() => { if (!query) setSearchOpen(false); }}
                    />
                )}
                <button
                    type={searchOpen ? "submit" : "button"}
                    onClick={() => { if (!searchOpen) setSearchOpen(true); }}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={searchOpen ? "提交搜索" : "展开搜索"}
                    title={searchOpen ? "搜索" : "搜索"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.957l4.275 4.275a.75.75 0 1 0 1.06-1.06l-4.275-4.275A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                    </svg>
                </button>
            </form>
        </header>
    )
}