import axios from "axios";
import { Category } from "@/types/Category";
import adminAxios from "@/api/adminAxios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getAllCategories(token: string): Promise<Category[]> {
    const response = await adminAxios.get(`/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
    }

    export async function createCategory(name: string, description: string, token: string): Promise<Category> {
    const response = await adminAxios.post(
        `${API_URL}/admin/categories`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
    }

    export async function updateCategory(id: string, name: string, token: string): Promise<Category> {
    const response = await adminAxios.put(
        `${API_URL}/admin/categories/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
    }

    export async function deleteCategory(id: string, token: string): Promise<void> {
    await axios.delete(`${API_URL}/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}