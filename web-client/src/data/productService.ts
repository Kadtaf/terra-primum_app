import axios from "axios";
import { Product } from "@/types/Product";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getAllProducts(token: string): Promise<Product[]> {
    const response = await axios.get(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data || response.data.products || [];
    }

    export async function createProduct(
    payload: Omit<Product, "id" | "createdAt" | "updatedAt">
    & { price: number }
    & { image?: string },
    token: string
    ): Promise<Product> {
    const response = await axios.post(`${API_URL}/admin/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data || response.data.product;
    }

    export async function updateProduct(
    id: string,
    payload: Partial<Product> & { price?: number },
    token: string
    ): Promise<Product> {
    const response = await axios.put(`${API_URL}/admin/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data || response.data.product;
    }

    export async function deleteProduct(id: string, token: string): Promise<void> {
    await axios.delete(`${API_URL}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}