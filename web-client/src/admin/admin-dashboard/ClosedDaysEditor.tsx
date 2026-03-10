import { useEffect, useState } from "react";

// Composant pour éditer les jours fermés
interface Props {
    closedDays: string[];
    onSave: (closedDays: string[]) => void;
}

const days = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
];

// Composant pour éditer les jours fermés
export default function ClosedDaysEditor({ closedDays, onSave }: Props) {
    const [localDays, setLocalDays] = useState<string[]>(closedDays);
    const [loading, setLoading] = useState(false);
    
    // Mise à jour des jours fermés locaux lors de la modification
    useEffect(() => {
        setLocalDays(closedDays);
    }, [closedDays]);
    
    // Toggle d'un jour dans la liste des jours fermés
    const toggleDay = (day: string) => {
        setLocalDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };
    // Sauvegarde des jours fermés sélectionnés
    const handleSave = () => {
        setLoading(true);
        onSave(localDays);
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Jours fermés</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {days.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={localDays.includes(key)}
                onChange={() => toggleDay(key)}
                />
                <span>{label}</span>
            </label>
            ))}
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