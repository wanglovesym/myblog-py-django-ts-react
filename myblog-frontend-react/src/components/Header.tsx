import { useState } from "react";
// 用于前端路由跳转
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <header className="mb-8 pb-4 border-b">
            <h1 className="text-2xl font-bold">
                <a href="/" className="text-blue-600 hover:underline">我的博客</a>
            </h1>
            <form onSubmit={handleSearch} className="mt-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索文章..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </form>
        </header>
    )
}