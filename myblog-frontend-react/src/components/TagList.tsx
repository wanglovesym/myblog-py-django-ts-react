import { useState, useEffect } from "react";
import axios from "axios";
import type { Tag } from "../types"
// 引入 API 配置：统一管理后端地址
import { API_URL } from '../config/api';

// 用于获取文章标签列表
export default function TagList() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                // 使用动态配置的 API 地址
                const response = await axios.get<Tag[]>(`${API_URL}/tags/`);
                setTags(response.data);
            } catch (error) {
                console.error("获取标签列表失败:", error);
            } finally {
                setLoading(false)
            }
        }

        fetchTags();
    }, []);

    if (loading) {
        return <div>加载中...</div>
    }

    return (
        // <div className="mb-6">
        //     <h3 className="text-lg font-semibold mb-2">标签</h3>
        //     <ul className="space-y-1">
        //         {tags.map(cat => (
        //             <li key={cat.id}>
        //                 <a
        //                     href={`/tag/${cat.id}`}
        //                     className="text-blue-600 hover:underline"
        //                 >
        //                     {cat.name}
        //                 </a>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <a
                        key={tag.id}
                        href={`/tag/${tag.id}`}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:underline"
                    >
                        {tag.name}
                    </a>
                ))}
            </div>
        </div>
    )
}