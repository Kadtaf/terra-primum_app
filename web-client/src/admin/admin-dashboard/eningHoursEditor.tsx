import { useState } from "react";

interface Props {
    openingHours: {
        [day: string]: { open: string; close: string };
    };
    onSave: (openingHours: any) => void;
    }

    const days = [
    "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday", "sunday"
    ];

    export default function OpeningHoursEditor({ openingHours, onSave }: Props) {
    const [localHours, setLocalHours] = useState(openingHours);

    const handleChange = (day: string, field: "open" | "close", value: string) => {
        setLocalHours({
        ...localHours,
        [day]: { ...localHours[day], [field]: value },
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Horaires d'ouverture</h2>

        {days.map((day) => (
            <div key={day} className="grid grid-cols-3 gap-4 items-center">
            <span className="capitalize font-medium">{day}</span>

            <input
                type="time"
                value={localHours[day].open}
                onChange={(e) => handleChange(day, "open", e.target.value)}
                className="border px-3 py-2 rounded"
            />

            <input
                type="time"
                value={localHours[day].close}
                onChange={(e) => handleChange(day, "close", e.target.value)}
                className="border px-3 py-2 rounded"
            />
            </div>
        ))}

        <button
            onClick={() => onSave(localHours)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Enregistrer
        </button>
        </div>
    );
}