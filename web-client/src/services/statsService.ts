import adminAxios from "@/api/adminAxios";
import axios from "axios";
import api from "@/api/adminAxios";
import { RevenueByCategory } from "@/types/statsTypes";
import { RevenueLastMonths } from "@/types/RevenueLastMonths";
import { HeatmapResponse } from "@/types/HeatmapPoint";
import { WeeklyHeatmapResponse } from "@/types/WeeklyHeatmapPoint";

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

    export async function getTopCategories(token: string) {
        const res = await fetch(`${API_URL}/admin/stats/top-categories`, {
            headers: { Authorization: `Bearer ${token}` },
        });

    const json = await res.json();
    return json.data || [];
    }

    export async function getTopProductsByCategory(token: string) {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/stats/top-products-by-category`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            },
        );

        const json = await res.json();
        return json.data || [];
    }

    export async function getActiveHours(token: string) {
        const response = await axios.get(`${API_URL}/admin/stats/active-hours`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    }

    export async function getRevenueByCategory(
        token: string,
        previous: boolean = false,
        ): Promise<RevenueByCategory[]> {
        try {
            const url = previous
            ? "/admin/stats/revenue-by-category?previous=true"
            : "/admin/stats/revenue-by-category";

            const response = await api.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            // Ton backend renvoie { success: true, data: [...] }
            return response.data.data || [];
        } catch (error) {
            console.error("Erreur getRevenueByCategory:", error);
            return [];
        }
    }


    export async function getRevenueLast6Months(token: string): Promise<RevenueLastMonths[]> {
        try {
            const response = await api.get("/admin/stats/revenue-last-6-months", {
            headers: { Authorization: `Bearer ${token}` },
            });

            return response.data.data || [];
        } catch (error) {
            console.error("Erreur getRevenueLast6Months:", error);
            return [];
        }
    }

    
    export async function getSalesHeatmap(
        token: string,
        ): Promise<HeatmapResponse> {
        try {
            const response = await api.get("/admin/stats/heatmap-sales", {
            headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
        } catch (error) {
            console.error("Erreur getSalesHeatmap:", error);
            return { period: "", data: [] };
        }
    }

    export async function getWeeklyHeatmap(
        token: string,
        ): Promise<WeeklyHeatmapResponse> {
        try {
            const response = await api.get("/admin/stats/heatmap-week", {
            headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
        } catch (error) {
            console.error("Erreur getWeeklyHeatmap:", error);
            return { weekStart: "", weekEnd: "", data: [] };
        }
    }



