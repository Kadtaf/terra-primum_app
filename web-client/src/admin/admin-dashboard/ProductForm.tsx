import { useState, useEffect } from "react";
import { Product } from "@/types/Product";
import { createProduct, updateProduct } from "@/data/productService";
import { useAuthStore } from "@/stores/authStore";
import { Plus } from "lucide-react";

interface Props {
    product: Product | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: Props) {
    const token = useAuthStore.getState().token;

    const [name, setName] = useState("");
    const [price, setPrice] = useState<string>("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (product) {
        setName(product.name);
        setPrice(product.price.toString());
        setDescription(product.description);
        setCategory(product.category);
        setImage(product.image || "");
        } else {
        setName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setImage("");
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const payload = {
        name,
        description,
        price: parseFloat(price),
        category: category,
        image: image,
        isAvailable: true,
        };

        try {
        if (product) {
            await updateProduct(product.id, payload, token);
        } else {
            await createProduct(payload, token);
        }
        onSuccess();
        } catch (error) {
        console.error("Erreur lors de la sauvegarde du produit:", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
            {product ? "Modifier un produit" : "Ajouter un produit"}
        </h2>

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
                <option value="Sandwichs">Sandwichs</option>
                <option value="Burgers">Burgers</option>
                <option value="Salades">Salades</option>
                <option value="Accompagnements">Accompagnements</option>
                <option value="Boissons">Boissons</option>
                <option value="Desserts">Desserts</option>
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

            <div className="flex gap-2">
            <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                <Plus className="w-4 h-4" />
                {product ? "Mettre à jour" : "Ajouter"}
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