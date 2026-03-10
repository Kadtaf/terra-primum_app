import { Product } from "@/types/Product";
import { deleteProduct } from "@/services/productService";
import { useAuthStore } from "@/stores/authStore";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";   

// Composant pour afficher la liste des produits avec options de modification et suppression
interface Props {
    products: Product[];
    onEdit: (product: Product) => void;
    onChange: () => void;
}
// Ce composant affiche une liste de produits avec des boutons pour modifier ou supprimer chaque produit. Il gère également l'état de suppression en cours et les erreurs potentielles.
export default function ProductList({ products, onEdit, onChange }: Props) {
    const token = useAuthStore.getState().token;
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Fonction pour supprimer un produit en envoyant une requete DELETE /api/admin/products/:id
    const handleDelete = async (id: string) => {
        if (!token) return;
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

        try {
        setDeletingId(id);
        await deleteProduct(id);
        toast({
            title: "Produit supprimé",
            description: "Le produit a été supprimé avec succès.",
            });

        onChange();
        } catch (error) {
        console.error("Erreur lors de la suppression:", error);

        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de supprimer le produit.",
            });
            
        setError("Impossible de supprimer ce produit.");
        } finally {
        setDeletingId(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Produits</h2>

        {error && (
            <p className="text-red-600 mb-4 text-sm">{error}</p>
        )}

        {products.length === 0 && (
            <p className="text-gray-600 text-center py-6">
            Aucun produit pour le moment.
            </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
            <div
                key={product.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
            >
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
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {product.description}
                </p>
                <p className="text-xl font-bold text-blue-600">
                    {Number(product.price).toFixed(2)}€
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
                    disabled={deletingId === product.id}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                    ${
                        deletingId === product.id
                        ? "bg-red-200 text-red-400 cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === product.id ? "Suppression..." : "Supprimer"}
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}