import { useEffect, useState } from "react";

// Composant pour éditer les paramètres de livraison
interface Props {
    deliveryFee: number;
    minOrderAmount: number;
    onSave: (data: { deliveryFee: number; minOrderAmount: number }) => void;
}
// Composant pour éditer les paramètres de livraison
export default function DeliverySettingsEditor({
    deliveryFee,
    minOrderAmount,
    onSave,
    }: Props) {
    const [fee, setFee] = useState(deliveryFee);
    const [minAmount, setMinAmount] = useState(minOrderAmount);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Mise à jour des paramètres locaux lors de la modification
    useEffect(() => {
        setFee(deliveryFee);
        setMinAmount(minOrderAmount);
    }, [deliveryFee, minOrderAmount]);

    // Validation simple avant de sauvegarder
    const handleSave = () => {
        // Validation simple
        if (fee < 0) {
        setError("Les frais de livraison doivent être positifs.");
        return;
        }
        if (minAmount < 0) {
        setError("Le minimum de commande doit être positif.");
        return;
        }

        setError(null);
        setLoading(true);

        onSave({ deliveryFee: fee, minOrderAmount: minAmount });

        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Livraison</h2>

        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block mb-1 font-medium">Frais de livraison (€)</label>
            <input
                type="number"
                step="0.01"
                value={fee}
                onChange={(e) => setFee(parseFloat(e.target.value))}
                className="border px-3 py-2 rounded w-full"
            />
            </div>

            <div>
            <label className="block mb-1 font-medium">Minimum de commande (€)</label>
            <input
                type="number"
                step="0.01"
                value={minAmount}
                onChange={(e) => setMinAmount(parseFloat(e.target.value))}
                className="border px-3 py-2 rounded w-full"
            />
            </div>
        </div>

        <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
            {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
        </div>
    );
}