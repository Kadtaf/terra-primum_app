import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getAllUsers, updateUserRole, toggleUserStatus } from "@/services/userService";
import { User } from "@/types/User";

export default function UsersManagement() {
    const token = useAuthStore.getState().token;

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour charger les utilisateurs depuis le backend
    const fetchUsers = async () => {
        try {
        if (!token) return;
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        } catch (err) {
        setError("Impossible de charger les utilisateurs.");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fonction pour changer le rôle d'un utilisateur il envoie une requete PUT /api/admin/users/:id/role avec le nouveau rôle dans le corps de la requete
    const handleRoleChange = async (id: string, role: string) => {
        if (!token) return;
        await updateUserRole(id, role);
        fetchUsers();
    };

    // Fonction pour activer/désactiver un utilisateur il envoie une requete PUT /api/admin/users/:id/toggle-status
    const handleToggleStatus = async (id: string) => {
        if (!token) return;

        const confirmAction = window.confirm(
        "Êtes-vous sûr de vouloir changer le statut de cet utilisateur ?"
        );
        if (!confirmAction) return;

        await toggleUserStatus(id);
        fetchUsers();
    };

    if (loading) {
        return <p className="text-gray-600">Chargement des utilisateurs...</p>;
    }

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    return (
        <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>

        <div className="bg-white p-6 rounded-lg shadow">
            <table className="w-full border-collapse">
            <thead>
                <tr className="text-left border-b bg-gray-50">
                <th className="p-2">Email</th>
                <th className="p-2">Rôle</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{u.email}</td>

                    <td className="p-2">
                    <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                    </select>
                    </td>

                    <td className="p-2">
                    {u.isActive ? (
                        <span className="text-green-600 font-medium">Actif</span>
                    ) : (
                        <span className="text-red-600 font-medium">Désactivé</span>
                    )}
                    </td>

                    <td className="p-2">
                    <button
                        onClick={() => handleToggleStatus(u.id)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        {u.isActive ? "Désactiver" : "Activer"}
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}