import { useState } from "react";

interface QuantityInputProps {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number; // par défaut 0.001
}

export function QuantityInput({
    value,
    onChange,
    className,
    placeholder = "0.000",
    min,
    max,
    step = 0.001,
    }: QuantityInputProps) {
    const [raw, setRaw] = useState<string>(value.toString());

    const handleBlur = () => {
        const num = parseFloat(raw);

        if (isNaN(num)) {
        setRaw("0");
        onChange(0);
        return;
        }

        let final = num;

        if (min != null && final < min) final = min;
        if (max != null && final > max) final = max;

        setRaw(final.toFixed(3));
        onChange(final);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // autoriser vide
        if (val === "") {
        setRaw("");
        onChange(0);
        return;
        }

        // autoriser uniquement chiffres + point/virgule
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
