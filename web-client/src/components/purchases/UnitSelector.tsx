interface UnitSelectorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    allowCustom?: boolean; // autoriser saisie libre
}

const DEFAULT_UNITS = [
    "kg",
    "g",
    "L",
    "mL",
    "cl",
    "pièce",
    "boîte",
    "sachet",
    "barquette",
    "bouteille",
    "bidon",
    "carton",
    "paquet",
];

export function UnitSelector({
    value,
    onChange,
    className,
    placeholder = "Unité",
    allowCustom = true,
    }: UnitSelectorProps) {
    const isCustom = value && !DEFAULT_UNITS.includes(value);

    return (
        <div className={`flex items-center gap-2 ${className ?? ""}`}>
        <select
            className="border rounded px-2 py-1"
            value={isCustom ? "__custom__" : value}
            onChange={(e) => {
            const val = e.target.value;

            if (val === "__custom__") {
                // on laisse l’utilisateur taper dans l’input
                return;
            }

            onChange(val);
            }}
        >
            <option value="">{placeholder}</option>

            {DEFAULT_UNITS.map((u) => (
            <option key={u} value={u}>
                {u}
            </option>
            ))}

            {allowCustom && <option value="__custom__">Autre…</option>}
        </select>

        {/* Champ libre si unité personnalisée */}
        {allowCustom && (
            <input
            type="text"
            className={`border rounded px-2 py-1 w-24 ${
                isCustom ? "block" : "hidden"
            }`}
            value={isCustom ? value : ""}
            placeholder="Unité"
            onChange={(e) => onChange(e.target.value)}
            />
        )}
        </div>
    );
}
