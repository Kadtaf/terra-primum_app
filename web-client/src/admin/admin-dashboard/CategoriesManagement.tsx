import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Category } from "@/types/Category";
import { getAllCategories } from "@/services/categoryService";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";

// Page de gestion des catégories du menu
export default function CategoriesManagement() {
    const token = useAuthStore.getState().token;

    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!token) return;

        try {
        setLoading(true);
        const data = await getAllCategories(token);
        setCategories(data);
        } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err);
        setError("Impossible de charger les catégories.");
        } finally {
        setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6">Gestion des Catégories</h1>

            <button
            onClick={() => setEditingCategory(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Ajouter une catégorie
            </button>
        </div>

        {/* Formulaire */}
        <CategoryForm
            category={editingCategory}
            onSuccess={() => {
            setEditingCategory(null);
            fetchCategories();
            }}
            onCancel={() => setEditingCategory(null)}
        />

        {/* Liste */}
        <CategoryList
            categories={categories}
            onEdit={(c) => setEditingCategory(c)}
            onChange={fetchCategories}
        />

        {categories.length === 0 && (
            <p className="text-gray-600 text-center py-6">
            Aucune catégorie pour le moment.
            </p>
        )}
        </div>
    );
}