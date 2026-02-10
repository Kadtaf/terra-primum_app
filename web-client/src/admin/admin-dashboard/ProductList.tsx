import { Product } from "@/types/Product";
import { deleteProduct } from "@/data/productService";
import { useAuthStore } from "@/stores/authStore";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
    products: Product[];
    onEdit: (product: Product) => void;
    onChange: () => void;
}

export default function ProductList({ products, onEdit, onChange }: Props) {
    const token = useAuthStore.getState().token;

    const handleDelete = async (id: string) => {
        if (!token) return;
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

        try {
        await deleteProduct(id, token);
        onChange();
        } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Produits</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
                {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                />
                )}

                <div className="mb-4">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-sm text-gray-700 mb-3">{product.description}</p>
                <p className="text-xl font-bold text-blue-600">
                    {product.price.toFixed(2)}€
                </p>
                </div>

                <div className="flex gap-2">
                <button
                    onClick={() => onEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200"
                >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                </button>
                <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200"
                >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}