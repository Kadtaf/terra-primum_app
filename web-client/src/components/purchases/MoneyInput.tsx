import { useState } from "react";

interface MoneyInputProps {
    value: number | null;
    onChange: (value: number | null) => void;
    className?: string;
    placeholder?: string;
    min?: number;
    max?: number;
}

export function MoneyInput({
    value,
    onChange,
    className,
    placeholder = "0.00 €",
    min,
    max,
    }: MoneyInputProps) {
    const [raw, setRaw] = useState<string>(value != null ? value.toString() : "");

    const handleBlur = () => {
        const num = parseFloat(raw);

        if (isNaN(num)) {
        setRaw("");
        onChange(null);
        return;
        }

        // bornes optionnelles
        if (min != null && num < min) {
        setRaw(min.toString());
        onChange(min);
        return;
        }

        if (max != null && num > max) {
        setRaw(max.toString());
        onChange(max);
        return;
        }

        setRaw(num.toFixed(2));
        onChange(num);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // autoriser vide
        if (val === "") {
        setRaw("");
        onChange(null);
        return;
        }

        // autoriser uniquement chiffres + point
        if (!/^[0-9]*[.,]?[0-9]*$/.test(val)) return;

        const normalized = val.replace(",", ".");
        setRaw(normalized);

        const num = parseFloat(normalized);
        if (!isNaN(num)) {
        onChange(num);
        }
    };

    return (
        <input
        type="text"
        className={`border rounded px-2 py-1 text-right ${className ?? ""}`}
        value={raw}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        />
    );
    }
