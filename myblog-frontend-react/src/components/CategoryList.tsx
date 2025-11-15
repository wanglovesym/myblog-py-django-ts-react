import { useEffect, useState } from "react";
import axios from "axios";
import type { Category } from "../types";

// 用于获取类型列表
export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await axios.get<Category[]>('/api/categories/');
                setCategories(response.data);
            } catch (error) {
                console.error('获取分类列表失败:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (loading) {
        return <div>加载中...</div>
    }

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">分类</h3>
            <ul className="space-y-1">
                {categories.map(cat => (
                    <li key={cat.id}>
                        <a
                            href={`/category/${cat.id}`}
                            className="text-blue-600 hover:underline"
                        >
                            {cat.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}