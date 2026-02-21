import { useState, useEffect } from "react";
import { Product } from "@/types/Product";
import { Category } from "@/types/Category";
import { createProduct, updateProduct } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { useAuthStore } from "@/stores/authStore";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Composant pour le formulaire de création / édition d'un produit
interface Props {
    product: Product | null;
    onSuccess: () => void;
    onCancel: () => void;
}

// Ce composant affiche un formulaire pour créer ou éditer un produit. Il gère les champs du formulaire, la validation, et envoie les données au backend via les fonctions createProduct ou updateProduct. Il affiche également les catégories disponibles dans un menu déroulant.
export default function ProductForm({ product, onSuccess, onCancel }: Props) {
    const token = useAuthStore.getState().token;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [price, setPrice] = useState<string>("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [ingredients, setIngredients] = useState<string>("");
    const [allergens, setAllergens] = useState<string>("");

    // Charger les catégories
    useEffect(() => {
        if (!token) return;
        getAllCategories(token).then(setCategories);
    }, [token]);

    // Pré-remplir si édition
    useEffect(() => {
        if (product) {
        setName(product.name);
        setPrice(product.price.toString());
        setDescription(product.description);
        setCategory(product.category);
        setImage(product.image || "");
        setIngredients(product.ingredients.join(", "));
        setAllergens(product.allergens.join(", "));
        } else {
        setName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setImage("");
        setIngredients("");
        setAllergens("");
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError(null);

        const payload = {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        ingredients: ingredients.split(",").map((i) => i.trim()),
        allergens: allergens.split(",").map((a) => a.trim()),
        available: true,
        };

        try {
        if (product) {
            await updateProduct(product.id, payload);
            toast({
                title: "Produit mis à jour",
                description: "Le produit a été mis à jour avec succès.",
                });
        } else {
            await createProduct(payload);
            toast({
                title: "Produit ajouté",
                description: "Le produit a été enregistré avec succès.",
                });
        }
        onSuccess();
        } catch (err) {
        console.error("Erreur lors de la sauvegarde du produit:", err);
        toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer le produit.",
        });
        setError("Impossible d’enregistrer le produit.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
            {product ? "Modifier un produit" : "Ajouter un produit"}
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="Nom du produit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-2 border rounded-lg"
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="px-4 py-2 border rounded-lg"
            >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => (
                <option key={c.id} value={c.name.toLowerCase()}>
                    {c.name}
                </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Prix (€)"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="px-4 py-2 border rounded-lg"
            />

            <input
                type="url"
                placeholder="URL de l'image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="px-4 py-2 border rounded-lg"
            />
            </div>

            <textarea
            placeholder="Description du produit"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg"
            />

            <input
            type="text"
            placeholder="Ingrédients (séparés par des virgules)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            />

            <input
            type="text"
            placeholder="Allergènes (séparés par des virgules)"
            value={allergens}
            onChange={(e) => setAllergens(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="flex gap-2">
            <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white 
                ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
            >
                <Plus className="w-4 h-4" />
                {loading ? "Enregistrement..." : product ? "Mettre à jour" : "Ajouter"}
            </button>

            {product && (
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