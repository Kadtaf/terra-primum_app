import adminAxios from "@/api/adminAxios";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getStatsOverview(token: string) {
    const response = await adminAxios.get(`${API_URL}/admin/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
    }

    export async function getSalesByDay(token: string) {
    const response = await axios.get(`${API_URL}/admin/stats/sales-by-day`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
    }

    export async function getTopProducts(token: string) {
    const response = await axios.get(`${API_URL}/admin/stats/top-products`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
    }

    export async function getActiveHours(token: string) {
    const response = await axios.get(`${API_URL}/admin/stats/active-hours`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
    }