import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Supplier {
    id: string;
    name: string;
}

interface InvoiceLine {
    id: string;
    productNameRaw: string;
    quantity: number;
    unit: string;
    unitPriceHt: string | null;
    totalPriceHt: string | null;
    vatRate: string | null;
}

interface PurchaseInvoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    totalHt: string | null;
    totalTtc: string | null;
    supplier: Supplier;
    lines: InvoiceLine[];
}

export default function PurchaseInvoiceDetail() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<PurchaseInvoice | null>(null);
    const [loading, setLoading] = useState(true);

    const { toast } = useToast();

    // Formulaire ajout ligne
    const [productNameRaw, setProductNameRaw] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [unitPriceHt, setUnitPriceHt] = useState("");
    const [vatRate, setVatRate] = useState("");

    // Mode édition de la facture
    const [isEditing, setIsEditing] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [editSupplierId, setEditSupplierId] = useState("");
    const [editInvoiceNumber, setEditInvoiceNumber] = useState("");
    const [editInvoiceDate, setEditInvoiceDate] = useState("");
    const [editTotalHt, setEditTotalHt] = useState("");
    const [editTotalTtc, setEditTotalTtc] = useState("");

    const fetchInvoice = async () => {
        try {
        const res = await fetch(`/api/purchase-invoices/${id}`);
        const data = await res.json();
        setInvoice(data);

        // Init des champs d'édition
        if (data) {
            setEditSupplierId(data.supplier?.id ?? "");
            setEditInvoiceNumber(data.invoiceNumber ?? "");
            // invoiceDate venant du backend est souvent "YYYY-MM-DD" déjà
            setEditInvoiceDate(
            data.invoiceDate ? data.invoiceDate.substring(0, 10) : "",
            );
            setEditTotalHt(data.totalHt ?? "");
            setEditTotalTtc(data.totalTtc ?? "");
        }
        } catch (error) {
        console.error("Erreur chargement facture :", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    // Charger la liste des fournisseurs pour le select en édition
    useEffect(() => {
        const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/admin/suppliers");
            const data = await res.json();
            if (Array.isArray(data)) {
            setSuppliers(data);
            }
        } catch (error) {
            console.error("Erreur chargement fournisseurs :", error);
        }
        };

        fetchSuppliers();
    }, []);

    const handleAddLine = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
        lines: [
            {
            productNameRaw,
            quantity: parseFloat(quantity),
            unit,
            unitPriceHt: unitPriceHt ? parseFloat(unitPriceHt) : null,
            totalPriceHt: unitPriceHt
                ? parseFloat(unitPriceHt) * parseFloat(quantity)
                : null,
            vatRate: vatRate ? parseFloat(vatRate) : null,
            },
        ],
        };

        try {
        const res = await fetch(`/api/purchase-invoices/${id}/lines`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erreur ajout ligne");

        toast({
            title: "Ligne ajoutée",
            description: "La ligne a été ajoutée avec succès.",
        });

        // Recharger la facture
        fetchInvoice();

        // Reset form
        setProductNameRaw("");
        setQuantity("");
        setUnit("");
        setUnitPriceHt("");
        setVatRate("");
        } catch (error) {
        toast({
            title: "Erreur",
            description: "Impossible d'ajouter la ligne.",
            variant: "destructive",
        });
        }
    };

    const handleUpdateInvoice = async () => {
        if (!invoice) return;

        try {
        const res = await fetch(`/api/purchase-invoices/${invoice.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            supplierId: editSupplierId,
            invoiceNumber: editInvoiceNumber,
            invoiceDate: editInvoiceDate,
            totalHt: editTotalHt ? parseFloat(editTotalHt) : null,
            totalTtc: editTotalTtc ? parseFloat(editTotalTtc) : null,
            }),
        });

        if (!res.ok) {
            throw new Error("Erreur mise à jour facture");
        }

        const updated = await res.json();
        setInvoice(updated);
        setIsEditing(false);

        toast({
            title: "Facture mise à jour",
            description: "Les informations de la facture ont été mises à jour.",
        });
        } catch (error) {
        console.error(error);
        toast({
            title: "Erreur",
            description: "Impossible de mettre à jour la facture.",
            variant: "destructive",
        });
        }
    };

    if (loading) {
        return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
        );
    }

    if (!invoice) {
        return <p className="text-center text-red-500">Facture introuvable.</p>;
    }

    return (
        <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Facture {invoice.invoiceNumber}</h1>

        {/* Informations facture */}
        <Card>
            <CardHeader className="flex justify-between items-center">
            <CardTitle>Informations</CardTitle>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing((prev) => !prev)}
            >
                {isEditing ? "Annuler" : "Modifier"}
            </Button>
            </CardHeader>
            <CardContent className="space-y-2">
            {isEditing ? (
                <div className="space-y-3">
                {/* Fournisseur */}
                <div>
                    <label className="block mb-1 font-medium">Fournisseur</label>
                    <select
                    className="w-full border rounded p-2"
                    value={editSupplierId}
                    onChange={(e) => setEditSupplierId(e.target.value)}
                    >
                    {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                        {s.name}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Numéro de facture */}
                <div>
                    <label className="block mb-1 font-medium">
                    Numéro de facture
                    </label>
                    <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={editInvoiceNumber}
                    onChange={(e) => setEditInvoiceNumber(e.target.value)}
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block mb-1 font-medium">Date</label>
                    <input
                    type="date"
                    className="w-full border rounded p-2"
                    value={editInvoiceDate}
                    onChange={(e) => setEditInvoiceDate(e.target.value)}
                    />
                </div>

                {/* Totaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                    <label className="block mb-1 font-medium">Total HT</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full border rounded p-2"
                        value={editTotalHt}
                        onChange={(e) => setEditTotalHt(e.target.value)}
                    />
                    </div>
                    <div>
                    <label className="block mb-1 font-medium">Total TTC</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full border rounded p-2"
                        value={editTotalTtc}
                        onChange={(e) => setEditTotalTtc(e.target.value)}
                    />
                    </div>
                </div>

                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleUpdateInvoice}>Enregistrer</Button>
                </div>
            ) : (
                <>
                <p>
                    <strong>Fournisseur :</strong> {invoice.supplier.name}
                </p>
                <p>
                    <strong>Date :</strong> {invoice.invoiceDate}
                </p>
                <p>
                    <strong>Total HT :</strong> {invoice.totalHt ?? "-"}
                </p>
                <p>
                    <strong>Total TTC :</strong> {invoice.totalTtc ?? "-"}
                </p>
                </>
            )}
            </CardContent>
        </Card>

        {/* Lignes facture */}
        <Card>
            <CardHeader className="flex justify-between items-center">
            <CardTitle>Lignes de facture</CardTitle>
            </CardHeader>

            <CardContent>
            {invoice.lines.length === 0 ? (
                <p className="text-muted-foreground">
                Aucune ligne pour le moment.
                </p>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Prix HT</TableHead>
                    <TableHead>Total HT</TableHead>
                    <TableHead>TVA</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {invoice.lines.map((line) => (
                    <TableRow key={line.id}>
                        <TableCell>{line.productNameRaw}</TableCell>
                        <TableCell>{line.quantity}</TableCell>
                        <TableCell>{line.unit}</TableCell>
                        <TableCell>{line.unitPriceHt ?? "-"}</TableCell>
                        <TableCell>{line.totalPriceHt ?? "-"}</TableCell>
                        <TableCell>{line.vatRate ?? "-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>

        {/* Ajouter une ligne */}
        <Card>
            <CardHeader>
            <CardTitle>Ajouter une ligne</CardTitle>
            </CardHeader>

            <CardContent>
            <form
                onSubmit={handleAddLine}
                className="grid grid-cols-1 md:grid-cols-6 gap-4"
            >
                <input
                type="text"
                placeholder="Produit"
                className="border rounded p-2"
                value={productNameRaw}
                onChange={(e) => setProductNameRaw(e.target.value)}
                required
                />

                <input
                type="number"
                step="0.001"
                placeholder="Quantité"
                className="border rounded p-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                />

                <input
                type="text"
                placeholder="Unité (kg, L, etc.)"
                className="border rounded p-2"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                />

                <input
                type="number"
                step="0.01"
                placeholder="Prix HT"
                className="border rounded p-2"
                value={unitPriceHt}
                onChange={(e) => setUnitPriceHt(e.target.value)}
                />

                <input
                type="number"
                step="0.01"
                placeholder="TVA (%)"
                className="border rounded p-2"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                />

                <Button type="submit" className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}
