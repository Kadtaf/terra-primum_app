import axios from "axios";

const adminAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
    });

    // Ajouter automatiquement le token admin
    adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default adminAxios;