import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import SearchResult from "./pages/SearchResult";
import Header from './components/Header';
import CategoryPostList from "./pages/CategoryPostList";
import TagPostList from "./pages/TagPostList";

function Layout() {
    return (
        <>
            <Header></Header>
            <Outlet></Outlet>
        </>
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