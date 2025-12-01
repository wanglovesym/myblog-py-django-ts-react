import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import SearchResult from "./pages/SearchResult";
import Header from './components/Header';
import CategoryPostList from "./pages/CategoryPostList";
import TagPostList from "./pages/TagPostList";

function Layout() {
    return (
        <div className="w-full min-w-screen h-full min-h-screen bg-[#1e293b] text-[#f1f5f9]">
            <Header/>
            {/* content 部分布局 */}
            <main className='px-4 py-8 w-48'>
                <Outlet />
            </main>
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
            // 重定向未知路由到首页（可选）
            // {
            //     path: "*",
            //     element: <Navigate to="/" replace />
            // },
        ]
    }
])