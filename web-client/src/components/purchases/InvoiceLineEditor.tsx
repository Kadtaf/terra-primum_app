import { IngredientSelector } from "./IngredientSelector";
import { QuantityInput } from "./QuantityInput";
import { UnitSelector } from "./UnitSelector";
import { MoneyInput } from "./MoneyInput";
import { Button } from "@/components/ui/button";

interface Ingredient {
    id: string;
    name: string;
    unit: string;
    category?: string;
}

/**
 * Base minimale que toute ligne doit respecter
 * (OCR + création manuelle)
 */
export interface InvoiceLineData {
    id: string;
    ingredientId: string | null;
    quantity: number;
    unit: string;
    unitPriceHt: number | null;
    vatRate?: number | null; // devient optionnel
    [key: string]: unknown;
}

/**
 * Le composant devient générique :
 * il accepte n’importe quel type T tant qu’il étend BaseInvoiceLine
 */
interface InvoiceLineEditorProps {
    line: InvoiceLineData;
    ingredients: Ingredient[];
    onChange: (updated: InvoiceLineData) => void;
    onDelete?: () => void;
    showVat?: boolean;
}

export function InvoiceLineEditor({
    line,
    ingredients,
    onChange,
    onDelete,
    showVat = true,
    }: InvoiceLineEditorProps) {
    // On utilise InvoiceLineData
    const update = (field: keyof InvoiceLineData, value: any) => {
        const updated: InvoiceLineData = { ...line, [field]: value };
        onChange(updated);
    };

    // unitPriceHt peut être null → on sécurise
    const total = ((line.quantity || 0) * (line.unitPriceHt ?? 0)).toFixed(2);

    return (
        <tr className="border-b">
        {/* Ingrédient */}
        <td className="py-2 pr-2">
            <IngredientSelector
            ingredients={ingredients}
            value={line.ingredientId}
            onChange={(v) => update("ingredientId", v)}
            className="w-full"
            />
        </td>

        {/* Quantité */}
        <td className="py-2 px-2 text-right">
            <QuantityInput
            value={line.quantity}
            onChange={(v) => update("quantity", v)}
            className="w-20"
            />
        </td>

        {/* Unité */}
        <td className="py-2 px-2">
            <UnitSelector
            value={line.unit}
            onChange={(v) => update("unit", v)}
            className="w-28"
            />
        </td>

        {/* Prix unitaire */}
        <td className="py-2 px-2 text-right">
            <MoneyInput
            value={line.unitPriceHt}
            onChange={(v) => update("unitPriceHt", v ?? 0)}
            className="w-24"
            />
        </td>

        {/* TVA */}
        {showVat && (
            <td className="py-2 px-2 text-right">
            <input
                type="number"
                step="0.01"
                className="border rounded px-2 py-1 w-20 text-right"
                value={line.vatRate ?? ""}
                onChange={(e) => update("vatRate", Number(e.target.value))}
            />
            </td>
        )}

        {/* Total */}
        <td className="py-2 px-2 text-right">{total} €</td>

        {/* Supprimer */}
        {onDelete && (
            <td className="py-2 pl-2 text-right">
            <Button variant="destructive" size="sm" onClick={onDelete}>
                Supprimer
            </Button>
            </td>
        )}
        </tr>
    );
}
