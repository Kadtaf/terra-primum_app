import adminAxios from "@/api/adminAxios";
import { User } from "@/types/User";

// Récupérer tous les utilisateurs
export async function getAllUsers(): Promise<User[]> {
    const response = await adminAxios.get("/admin/users");
    return response.data.data;
}

// Modifier le rôle d'un utilisateur
export async function updateUserRole(id: string, role: string) {
    const response = await adminAxios.put(`/admin/users/${id}/role`, { role });
    return response.data.data;
}

// Activer / désactiver un utilisateur
export async function toggleUserStatus(id: string) {
    const response = await adminAxios.put(`/admin/users/${id}/toggle-status`);
    return response.data.data;
}