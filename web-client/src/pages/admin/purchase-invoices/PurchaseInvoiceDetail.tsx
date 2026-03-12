import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    Loader2,
    PlusCircle,
    Trash2,
    Download,
    PackageCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StatusBadge } from "@/components/purchases/StatusBadge";

interface Supplier {
    id: string;
    name: string;
}

interface InvoiceLine {
    id: string;
    productNameRaw: string;
    quantity: number;
    unit: string;
    unitPriceHt: number | null;
    totalPriceHt: number | null;
    vatRate: number | null;
    [key: string]: unknown;
}

interface PurchaseInvoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    totalHt: number | null;
    totalTtc: number | null;
    supplier: Supplier;
    status: string;
    fileUrl?: string;
    lines: InvoiceLine[];
}

export default function PurchaseInvoiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [invoice, setInvoice] = useState<PurchaseInvoice | null>(null);
    const [loading, setLoading] = useState(true);

    // Edition
    const [isEditing, setIsEditing] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [editSupplierId, setEditSupplierId] = useState("");
    const [editInvoiceNumber, setEditInvoiceNumber] = useState("");
    const [editInvoiceDate, setEditInvoiceDate] = useState("");
    const [editTotalHt, setEditTotalHt] = useState("");
    const [editTotalTtc, setEditTotalTtc] = useState("");

    // Ajout ligne
    const [productNameRaw, setProductNameRaw] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [unitPriceHt, setUnitPriceHt] = useState("");
    const [vatRate, setVatRate] = useState("");

    // Charger facture
    const fetchInvoice = async () => {
        try {
        const res = await fetch(`/api/purchase-invoices/${id}`);
        const data = await res.json();
        setInvoice(data);

        if (data) {
            setEditSupplierId(data.supplier?.id ?? "");
            setEditInvoiceNumber(data.invoiceNumber ?? "");
            setEditInvoiceDate(data.invoiceDate?.substring(0, 10) ?? "");
            setEditTotalHt(data.totalHt?.toString() ?? "");
            setEditTotalTtc(data.totalTtc?.toString() ?? "");
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

    // Charger fournisseurs
    useEffect(() => {
        const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/admin/suppliers");
            const data = await res.json();
            if (Array.isArray(data)) setSuppliers(data);
        } catch (error) {
            console.error("Erreur chargement fournisseurs :", error);
        }
        };

        fetchSuppliers();
    }, []);

    // Ajouter ligne
    const handleAddLine = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
        lines: [
            {
            productNameRaw,
            quantity: parseFloat(quantity),
            unit,
            unitPriceHt: unitPriceHt ? parseFloat(unitPriceHt) : null,
            totalPriceHt:
                unitPriceHt && quantity
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

        fetchInvoice();

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

    // Mise à jour facture
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

        if (!res.ok) throw new Error("Erreur mise à jour facture");

        const updated = await res.json();
        setInvoice(updated);
        setIsEditing(false);

        toast({
            title: "Facture mise à jour",
            description: "Les informations ont été mises à jour.",
        });
        } catch (error) {
        toast({
            title: "Erreur",
            description: "Impossible de mettre à jour la facture.",
            variant: "destructive",
        });
        }
    };

    // Appliquer au stock
    const handleApplyStock = async () => {
        if (!invoice) return;

        try {
        const res = await fetch(
            `/api/purchase-invoices/${invoice.id}/apply-to-stock`,
            {
            method: "POST",
            },
        );

        if (!res.ok) throw new Error("Erreur mise à jour stock");

        toast({
            title: "Stock mis à jour",
            description: "Les ingrédients ont été mis à jour.",
        });

        fetchInvoice();
        } catch (error) {
        toast({
            title: "Erreur",
            description: "Impossible d'appliquer au stock.",
            variant: "destructive",
        });
        }
    };

    // Supprimer facture
    const handleDelete = async () => {
        if (!invoice) return;

        try {
        const res = await fetch(`/api/purchase-invoices/${invoice.id}`, {
            method: "DELETE",
        });

        if (!res.ok && res.status !== 204) {
            throw new Error("Erreur suppression");
        }

        toast({
            title: "Facture supprimée",
            description: "La facture a été supprimée avec succès.",
        });

        navigate("/admin/purchase-invoices");
        } catch (error) {
        toast({
            title: "Erreur",
            description: "Impossible de supprimer la facture.",
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
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Facture {invoice.invoiceNumber}</h1>

            <div className="flex gap-3">
            {/* Télécharger PDF */}
            {invoice.fileUrl && (
                <Button
                variant="outline"
                onClick={() => window.open(invoice.fileUrl!, "_blank")}
                >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
                </Button>
            )}

            {/* Appliquer au stock */}
            {invoice.status === "VALIDATED" && (
                <Button
                className="bg-green-600 text-white"
                onClick={handleApplyStock}
                >
                <PackageCheck className="mr-2 h-4 w-4" />
                Appliquer au stock
                </Button>
            )}

            {/* Supprimer */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette facture ?</AlertDialogTitle>
                    <AlertDialogDescription>
                    Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDelete}
                    >
                    Confirmer
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        </div>

        {/* Résumé premium */}
        <Card>
            <CardHeader>
            <CardTitle>Résumé</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Fournisseur</p>
                <p className="font-medium">{invoice.supplier.name}</p>
            </div>

            <div>
                <p className="text-sm text-muted-foreground">Total HT</p>
                <p className="font-medium">{invoice.totalHt ?? "-"}</p>
            </div>

            <div>
                <p className="text-sm text-muted-foreground">Total TTC</p>
                <p className="font-medium">{invoice.totalTtc ?? "-"}</p>
            </div>

            <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <StatusBadge status={invoice.status} />
            </div>
            </CardContent>
        </Card>

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

                {/* Numéro */}
                <div>
                    <label className="block mb-1 font-medium">Numéro</label>
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

                <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleUpdateInvoice}
                >
                    Enregistrer
                </Button>
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
            <CardHeader>
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
