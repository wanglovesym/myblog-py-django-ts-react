import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import Post from "./pages/Post";
import SearchResult from "./pages/SearchResult";
import Header from './components/Header';
import CategoryPostList from "./pages/CategoryPostList";
import TagPostList from "./pages/TagPostList";

function Layout() {
    return (
        <div className="bg-white dark:bg-site-dark bg-no-repeat bg-top text-gray-900 dark:text-gray-100 transition-colors" style={{ minHeight: 'var(--dvh)' }}>
            <Header />
            {/* 主内容区域 */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Outlet />
            </main>
            {/* 页脚 */}
            <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} 雨影的小站 · Powered by React & Django
                    </p>
                </div>
            </footer>
        </div>
    )
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/blog",
                element: <Blog />
            },
            {
                path: "/projects",
                element: <Projects />
            },
            {
                path: "/post/:slug",
                element: <Post />
            },
            {
                path: "/search",
                element: <SearchResult />
            },
            {
                path: "/category/:id",
                element: <CategoryPostList />
            },
            {
                path: "/tag/:id",
                element: <TagPostList />
            }
        ]
    }
])