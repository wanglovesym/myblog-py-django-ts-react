import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
        return true;
    });

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

    // 简单搜索框展开逻辑
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const searchContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    // 移动端菜单
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            // 关闭搜索
            if (searchOpen && searchContainerRef.current && !searchContainerRef.current.contains(target)) {
                setSearchOpen(false);
            }
            // 关闭移动端菜单
            if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchOpen, mobileMenuOpen]);

    // 展开后自动聚焦
    useEffect(() => {
        if (searchOpen) {
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [searchOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setSearchOpen(false);
        setQuery('');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center justify-start">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">雨影的小站</span>
                        </Link>
                    </div>

                    {/* 导航链接 - 桌面端（居中列） */}
                    <div className="hidden md:flex items-center justify-center">
                        <nav className="flex items-center gap-6 h-9">
                            <Link to="/" className="flex items-center h-9 leading-none text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                                首页
                            </Link>
                            <Link to="/blog" className="flex items-center h-9 leading-none text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                                博客
                            </Link>
                            <Link to="/projects" className="flex items-center h-9 leading-none text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                                项目
                            </Link>
                        </nav>
                    </div>

                    {/* 右侧操作（右列靠右对齐） */}
                    <div className="flex items-center justify-end gap-3 h-9">
                        {/* 搜索：点击图标后向左展开 */}
                        <div ref={searchContainerRef} className="relative h-9 items-center hidden md:flex">
                            <form
                                onSubmit={handleSubmit}
                                className={`absolute right-0 top-0 h-9 flex items-center rounded-md overflow-hidden transition-all duration-300 ${searchOpen ? 'w-52 sm:w-64 px-2 shadow-md dark:shadow-md scale-100 border border-gray-300 dark:border-gray-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur ring-1 ring-blue-200/50 dark:ring-blue-300/30' : 'w-9 px-0 scale-90 border-transparent bg-transparent shadow-none'} `}
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setSearchOpen(false);
                                        }
                                        if (e.key === 'Enter') {
                                            // form submit will handle
                                        }
                                    }}
                                    placeholder="搜索..."
                                    className={`flex-1 min-w-0 text-sm bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white focus:outline-none transition-all duration-300 ${searchOpen ? 'opacity-100 px-1' : 'opacity-0 w-0 px-0'} `}
                                />
                                {/* 放大镜按钮：不再自动提交，只负责展开/聚焦/关闭 */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!searchOpen) {
                                            // 初次点击：展开
                                            setSearchOpen(true);
                                            return;
                                        }
                                        const trimmed = query.trim();
                                        if (!trimmed) {
                                            // 已展开且为空：关闭
                                            setSearchOpen(false);
                                            return;
                                        }
                                        // 已展开且有内容：执行搜索跳转并清空
                                        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
                                        setSearchOpen(false);
                                        setQuery('');
                                    }}
                                    aria-label="搜索"
                                    className={`shrink-0 w-9 h-9 flex items-center justify-center transition-all duration-300 ${searchOpen ? 'text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'} cursor-pointer`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.957l4.275 4.275a.75.75 0 1 0 1.06-1.06l-4.275-4.275A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </form>
                        </div>

                        {/* 暗色模式切换 */}
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            aria-label={isDark ? "切换到明亮模式" : "切换到暗色模式"}
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {/* 移动端菜单按钮（汉堡） */}
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); setMobileMenuOpen((v) => !v); }}
                            className="w-9 h-9 flex md:hidden items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            aria-label="打开菜单"
                            aria-expanded={mobileMenuOpen}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M3.75 6A.75.75 0 014.5 5.25h15a.75.75 0 110 1.5h-15A.75.75 0 013.75 6zm0 6a.75.75 0 01.75-.75h15a.75.75 0 110 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 110 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* 移动端下拉菜单 */}
                        {mobileMenuOpen && (
                            <div ref={mobileMenuRef} className="fixed left-0 right-0 top-16 md:hidden z-50 w-screen border-t border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur shadow-lg">
                                <div className="py-2 px-4 flex flex-col items-end text-right">
                                    <Link
                                        to="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="inline-flex justify-end w-full px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    >首页</Link>
                                    <Link
                                        to="/blog"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="inline-flex justify-end w-full px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    >博客</Link>
                                    <Link
                                        to="/projects"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="inline-flex justify-end w-full px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    >项目</Link>

                                    {/* 菜单内搜索：保留桌面动画，仅图标，点击展开输入并右对齐 */}
                                    <div className="relative w-full px-3 py-2">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const trimmed = query.trim();
                                                if (!trimmed) return;
                                                navigate(`/search?q=${encodeURIComponent(trimmed)}`);
                                                setSearchOpen(false);
                                                setMobileMenuOpen(false);
                                                setQuery('');
                                            }}
                                            className={`ml-auto relative h-9 flex items-center rounded-md overflow-hidden transition-all duration-300 ${searchOpen ? 'w-full max-w-[12rem] px-2 shadow-md dark:shadow-md scale-100 border border-gray-300 dark:border-gray-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur ring-1 ring-blue-200/50 dark:ring-blue-300/30' : 'w-9 px-0 scale-90 border-transparent bg-transparent shadow-none'} `}
                                        >
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') {
                                                        e.preventDefault();
                                                        setSearchOpen(false);
                                                    }
                                                }}
                                                placeholder="搜索..."
                                                className={`flex-1 min-w-0 text-sm font-bold bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white focus:outline-none transition-all duration-300 ${searchOpen ? 'opacity-100 px-1' : 'opacity-0 w-0 px-0'} `}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!searchOpen) { setSearchOpen(true); return; }
                                                    const trimmed = query.trim();
                                                    if (!trimmed) { setSearchOpen(false); return; }
                                                    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
                                                    setSearchOpen(false);
                                                    setMobileMenuOpen(false);
                                                    setQuery('');
                                                }}
                                                aria-label="搜索"
                                                className={`shrink-0 w-9 h-9 flex items-center justify-center transition-all duration-300 ${searchOpen ? 'text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'} cursor-pointer`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.957l4.275 4.275a.75.75 0 1 0 1.06-1.06l-4.275-4.275A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
