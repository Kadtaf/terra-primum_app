import axios from "axios";
import adminAxios from "@/api/adminAxios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getAllOrders(token: string) {
    const response = await adminAxios.get(`/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.orders;
    }

    export async function updateOrderStatus(id: string, status: string, token: string) {
    const response = await axios.put(
        `${API_URL}/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.order;
}