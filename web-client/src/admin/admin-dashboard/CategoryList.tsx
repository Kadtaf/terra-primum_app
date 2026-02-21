import { Category } from "@/types/Category";
import { deleteCategory } from "@/services/categoryService";
import { useAuthStore } from "@/stores/authStore";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
    categories: Category[];
    onEdit: (category: Category) => void;
    onChange: () => void;
}

export default function CategoryList({ categories, onEdit, onChange }: Props) {
    const token = useAuthStore.getState().token;
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!token) return;
        if (!confirm("Supprimer cette catégorie ?")) return;

        try {
        setLoadingId(id);
        setError(null);

        await deleteCategory(id, token);
        onChange();
        } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        setError("Impossible de supprimer la catégorie.");
        } finally {
        setLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Catégories</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        {categories.length === 0 && (
            <p className="text-gray-500">Aucune catégorie pour le moment.</p>
        )}

        <div className="space-y-2">
            {categories.map((c) => (
            <div
                key={c.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
            >
                <span className="font-medium">{c.name}</span>

                <div className="flex gap-2">
                <button
                    onClick={() => onEdit(c)}
                    className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                </button>

                <button
                    onClick={() => handleDelete(c.id)}
                    disabled={loadingId === c.id}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${
                    loadingId === c.id
                        ? "bg-red-200 text-red-400"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                >
                    <Trash2 className="w-4 h-4" />
                    {loadingId === c.id ? "Suppression..." : "Supprimer"}
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}