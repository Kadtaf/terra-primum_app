import { Ingredient } from "../../types/Ingredient";
import { useMemo } from "react";

interface IngredientSelectorProps {
    ingredients: Ingredient[];
    value: string | null;
    onChange: (ingredientId: string | null) => void;
    className?: string;
    placeholder?: string;
}

export function IngredientSelector({
    ingredients,
    value,
    onChange,
    className,
    placeholder = "Sélectionner un ingrédient",
    }: IngredientSelectorProps) {
    const sortedIngredients = useMemo(
        () =>
        [...ingredients].sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
        ),
        [ingredients],
    );

    return (
        <select
        className={className ?? "border rounded px-2 py-1 w-full"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        >
        <option value="">{placeholder}</option>
        {sortedIngredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
            {ing.name} ({ing.unit})
            </option>
        ))}
        </select>
    );
}
