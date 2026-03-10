import adminAxios from "@/api/adminAxios";
import { RestaurantSettings } from "@/types/RestaurantSettings";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getRestaurantSettings(token: string): Promise<RestaurantSettings> {
    const response = await adminAxios.get(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    // Le backend renvoie directement l'objet settings
    return response.data;
}

export async function updateRestaurantSettings(
    payload: Partial<RestaurantSettings>,
    token: string
): Promise<RestaurantSettings> {
    const response = await adminAxios.put(`${API_URL}/admin/settings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });

    // Le backend renvoie { message, settings }
    return response.data.settings;
}

export async function resetRestaurantSettings(token: string): Promise<RestaurantSettings> {
    const response = await adminAxios.post(`${API_URL}/admin/settings/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.settings;
}

export async function getPublicRestaurantSettings(): Promise<RestaurantSettings> {
    const response = await axios.get(`${API_URL}/public/settings`);
    return response.data;
}