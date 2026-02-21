import { useEffect, useState } from "react";

interface DayHours {
    open: string;
    close: string;
}

interface Props {
    openingHours: {
        [day: string]: DayHours | null;
    };
    onSave: (openingHours: { [day: string]: DayHours | null }) => void;
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

export default function OpeningHoursEditor({ openingHours, onSave }: Props) {
    const [localHours, setLocalHours] = useState(openingHours);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLocalHours(openingHours);
    }, [openingHours]);

    const toggleClosed = (day: string) => {
        const isClosed = localHours[day] === null;

        setLocalHours({
        ...localHours,
        [day]: isClosed ? { open: "", close: "" } : null,
        });
    };

    const handleChange = (day: string, field: "open" | "close", value: string) => {
        const current = localHours[day] || { open: "", close: "" };

        setLocalHours({
        ...localHours,
        [day]: { ...current, [field]: value },
        });
    };

    const handleSave = () => {
        for (const day of Object.keys(localHours)) {
        const hours = localHours[day];

        if (!hours) continue;

        if (hours.open >= hours.close) {
            setError(`L'heure de fermeture doit être après l'ouverture (${day}).`);
            return;
        }
        }

        setError(null);
        onSave(localHours);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Horaires d'ouverture</h2>

        {error && <p className="text-red-600">{error}</p>}

        {days.map(({ key, label }) => {
        const hours = localHours[key];
        const isClosed = hours === null;

        return (
            <div
            key={key}
            className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100"
            >
            {/* Jour */}
            <span className="font-medium">{label}</span>

            {/* Checkbox + label dans le même bloc */}
            <div className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={isClosed}
                onChange={() => toggleClosed(key)}
                className="h-4 w-4"
                />
                <span className="text-sm">Fermé</span>
            </div>

            {/* Heure d'ouverture */}
            {isClosed ? (
                <span className="text-gray-400 text-center">—</span>
            ) : (
                <input
                type="time"
                value={hours?.open || ""}
                onChange={(e) => handleChange(key, "open", e.target.value)}
                className="border px-3 py-2 rounded w-full"
                />
            )}

            {/* Heure de fermeture */}
            {isClosed ? (
                <span className="text-gray-400 text-center">—</span>
            ) : (
                <input
                type="time"
                value={hours?.close || ""}
                onChange={(e) => handleChange(key, "close", e.target.value)}
                className="border px-3 py-2 rounded w-full"
                />
            )}
            </div>
        );
        })}

        <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Enregistrer
        </button>
        </div>
    );
}