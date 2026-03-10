import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/cartStore";

interface ProductCardProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    allergens?: string[];
  onClick?: () => void; // utile pour admin
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    image,
    allergens,
    onClick,
}: ProductCardProps) {
    const { addItem } = useCartStore();

    const handleAdd = () => {
        addItem({ id, name, price, image }, 1);
    };

    return (
        <div
        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
        onClick={onClick}
        >
        {image ? (
            <img src={image} alt={name} className="w-full h-48 object-cover" />
        ) : (
            <div className="w-full h-48 bg-secondary flex items-center justify-center text-muted">
            Pas d’image
            </div>
        )}

        <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{name}</h3>

            {description && (
            <p className="text-sm text-muted mb-3">{description}</p>
            )}

            {allergens && allergens.length > 0 && (
            <p className="text-xs text-muted mb-3">
                Allergènes : {allergens.join(", ")}
            </p>
            )}

            <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
                {price.toFixed(2)}€
            </span>

            <button
                onClick={(e) => {
                e.stopPropagation();
                handleAdd();
                }}
                className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition"
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
            </div>
        </div>
        </div>
    );
}