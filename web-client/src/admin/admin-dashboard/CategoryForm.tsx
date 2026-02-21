import { useState, useEffect } from "react";
import { Category } from "@/types/Category";
import { createCategory, updateCategory } from "@/services/categoryService";
import { useAuthStore } from "@/stores/authStore";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
    category: Category | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CategoryForm({ category, onSuccess, onCancel }: Props) {
    const token = useAuthStore.getState().token;
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pré-remplir si on édite
    useEffect(() => {
        if (category) {
        setName(category.name);
        setDescription(category.description || "");
        } else {
        setName("");
        setDescription("");
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (name.trim().length < 2) {
        setError("Le nom doit contenir au moins 2 caractères.");
        return;
        }

        try {
        setLoading(true);
        setError(null);

        if (category) {
            await updateCategory(category.id, name, description);

            toast({
            title: "Catégorie mise à jour",
            description: "La catégorie a été modifiée avec succès.",
            });

        } else {
            await createCategory(name, description, token);

            toast({
            title: "Catégorie ajoutée",
            description: "La nouvelle catégorie a été créée avec succès.",
            });
        }

        onSuccess();

        } catch (err) {
        console.error("Erreur lors de la sauvegarde :", err);

        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'enregistrer la catégorie.",
        });

        setError("Impossible d'enregistrer la catégorie.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
            {category ? "Modifier une catégorie" : "Ajouter une catégorie"}
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Champ nom */}
            <input
            type="text"
            placeholder="Nom de la catégorie"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            />

            {/* ⭐ Champ description */}
            <textarea
            placeholder="Description de la catégorie (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            />

            <div className="flex gap-2">
            <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg ${
                loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                <Plus className="w-4 h-4" />
                {loading
                ? "Enregistrement..."
                : category
                ? "Mettre à jour"
                : "Ajouter"}
            </button>

            {category && (
                <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                Annuler
                </button>
            )}
            </div>
        </form>
        </div>
    );
}