import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Ingredient } from "@/types/Ingredient";
import { InvoiceLineEditor } from "@/components/purchases/InvoiceLineEditor";

interface Supplier {
    id: string;
    name: string;
}

interface InvoiceLine {
    id: string;
    ingredientId: string | null;
    quantity: number;
    unit: string;
    unitPriceHt: number | null;
    vatRate?: number | null;
    [key: string]: unknown;
    
}

export default function PurchaseInvoiceCreate() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const [supplierId, setSupplierId] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [totalHt, setTotalHt] = useState("");
    const [totalTtc, setTotalTtc] = useState("");

    const [lines, setLines] = useState<InvoiceLine[]>([]);

    const [file, setFile] = useState<File | null>(null);

    const { toast } = useToast();
    const navigate = useNavigate();

    // Charger fournisseurs
    useEffect(() => {
        fetch("/api/admin/suppliers")
        .then((res) => res.json())
        .then((data) => setSuppliers(data))
        .catch(() => console.error("Erreur chargement fournisseurs"));
    }, []);

    // Charger ingrédients
    useEffect(() => {
        fetch("/api/ingredients")
        .then((res) => res.json())
        .then((data) => setIngredients(data))
        .catch(() => console.error("Erreur chargement ingrédients"));
    }, []);

    // Ajouter une ligne vide
    const addLine = () => {
        setLines((prev) => [
        ...prev,
        {
            id: crypto.randomUUID(),
            ingredientId: null,
            quantity: 0,
            unit: "",
            unitPriceHt: 0,
            vatRate: null,
        },
        ]);
    };

    // Modifier une ligne
    const updateLine = (index: number, updatedLine: InvoiceLine) => {
        setLines((prev) => prev.map((l, i) => (i === index ? updatedLine : l)));
    };

    // Supprimer une ligne
    const removeLine = (index: number) => {
        setLines((prev) => prev.filter((_, i) => i !== index));
    };

    // Soumission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uploadedFileUrl = null;

        // Upload fichier si présent
        if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/purchase-invoices/upload", {
            method: "POST",
            body: formData,
        });

        const uploadData = await uploadRes.json();
        uploadedFileUrl = uploadData.fileUrl;
        }

        const payload = {
            supplierId,
            invoiceNumber,
            invoiceDate,
            totalHt: totalHt ? parseFloat(totalHt) : null,
            totalTtc: totalTtc ? parseFloat(totalTtc) : null,
            rawFileUrl: uploadedFileUrl,
            lines: lines
            .filter((l) => l.ingredientId && l.quantity > 0)
            .map((l) => {
                const unitPrice = l.unitPriceHt ?? 0; // fallback à 0 si null

                return {
                    ingredientId: l.ingredientId,
                    quantity: l.quantity,
                    unit: l.unit,
                    unitPriceHt: unitPrice,
                    totalPriceHt: l.quantity * unitPrice,
                    vatRate: l.vatRate ?? null,
                };
            }),
        };

        try {
        const res = await fetch("/api/purchase-invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erreur création facture");

        toast({
            title: "Facture créée",
            description: "La facture a été ajoutée avec succès.",
        });

        navigate("/admin/purchase-invoices");
        } catch (error) {
        toast({
            title: "Erreur",
            description: "Impossible de créer la facture.",
            variant: "destructive",
        });
        }
    };

    return (
        <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Créer une facture fournisseur</h1>

        {/* Informations générales */}
        <Card>
            <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            </CardHeader>

            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fournisseur */}
                <div>
                <label className="block mb-1 font-medium">Fournisseur</label>
                <select
                    className="w-full border rounded p-2"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    required
                >
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* Numéro */}
                <div>
                <label className="block mb-1 font-medium">
                    Numéro de facture
                </label>
                <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    required
                />
                </div>

                {/* Date */}
                <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                    type="date"
                    className="w-full border rounded p-2"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                />
                </div>

                {/* Totaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">Total HT</label>
                    <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded p-2"
                    value={totalHt}
                    onChange={(e) => setTotalHt(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Total TTC</label>
                    <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded p-2"
                    value={totalTtc}
                    onChange={(e) => setTotalTtc(e.target.value)}
                    />
                </div>
                </div>

                {/* Fichier */}
                <div>
                <label className="block mb-1 font-medium">
                    Fichier (PDF / image)
                </label>
                <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full border rounded p-2"
                />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                Créer la facture
                </Button>
            </form>
            </CardContent>
        </Card>

        {/* Lignes */}
        <Card>
            <CardHeader>
            <CardTitle>Lignes de facture</CardTitle>
            </CardHeader>

            <CardContent>
            <Button onClick={addLine} className="mb-4">
                Ajouter une ligne
            </Button>

            {lines.length === 0 ? (
                <p className="text-muted-foreground">
                Aucune ligne pour le moment.
                </p>
            ) : (
                <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b">
                    <th>Ingrédient</th>
                    <th>Qté</th>
                    <th>Unité</th>
                    <th>PU HT</th>
                    <th>TVA</th>
                    <th>Total</th>
                    <th></th>
                    </tr>
                </thead>

                <tbody>
                    {lines.map((line, index) => (
                    <InvoiceLineEditor
                        key={line.id}
                        line={line}
                        ingredients={ingredients}
                        onChange={(updated) => updateLine(index, updated)}
                        onDelete={() => removeLine(index)}
                    />
                    ))}
                </tbody>
                </table>
            )}
            </CardContent>
        </Card>
        </div>
    );
    }
