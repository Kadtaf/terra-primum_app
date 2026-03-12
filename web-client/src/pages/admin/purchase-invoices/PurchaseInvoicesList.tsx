import { useEffect, useState } from "react";
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

import { Loader2, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { StatusBadge } from "@/components/purchases/StatusBadge";

interface Supplier {
    id: string;
    name: string;
}

interface PurchaseInvoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    totalHt: string | null;
    totalTtc: string | null;
    supplier: Supplier;
    status: string;
}

export default function PurchaseInvoicesList() {
    const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
        try {
            const res = await fetch("/api/purchase-invoices");
            if (!res.ok) throw new Error("Erreur lors du chargement des factures");

            const data = await res.json();
            setInvoices(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchInvoices();
    }, []);

    return (
        <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Factures fournisseurs</h1>

            <Button
            className="bg-black text-white border-black hover:bg-amber-400 hover:text-black"
            onClick={() => navigate("/admin/purchase-invoices/new")}
            >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une facture
            </Button>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Liste des factures</CardTitle>
            </CardHeader>

            <CardContent>
            {loading ? (
                <div className="flex justify-center py-10">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : invoices.length === 0 ? (
                <p className="text-muted-foreground">
                Aucune facture pour le moment.
                </p>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total HT</TableHead>
                    <TableHead>Total TTC</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    <TableHead>Statut</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell>{invoice.supplier?.name}</TableCell>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.invoiceDate}</TableCell>
                        <TableCell>{invoice.totalHt ?? "-"}</TableCell>
                        <TableCell>{invoice.totalTtc ?? "-"}</TableCell>
                        <TableCell>
                        <StatusBadge status={invoice.status} />
                        </TableCell>

                        <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                navigate(`/admin/purchase-invoices/${invoice.id}`)
                            }
                            >
                            Voir
                            </Button>

                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                Supprimer
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Supprimer cette facture ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. La facture et
                                    toutes ses lignes seront définitivement
                                    supprimées.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={async () => {
                                    try {
                                        const res = await fetch(
                                        `/api/purchase-invoices/${invoice.id}`,
                                        {
                                            method: "DELETE",
                                        },
                                        );

                                        if (!res.ok && res.status !== 204) {
                                        throw new Error("Erreur suppression");
                                        }

                                        setInvoices((prev) =>
                                        prev.filter(
                                            (inv) => inv.id !== invoice.id,
                                        ),
                                        );

                                        toast({
                                        title: "Facture supprimée",
                                        description:
                                            "La facture a été supprimée avec succès.",
                                        });
                                    } catch (error) {
                                        console.error(error);
                                        toast({
                                        title: "Erreur",
                                        description:
                                            "Impossible de supprimer la facture.",
                                        variant: "destructive",
                                        });
                                    }
                                    }}
                                >
                                    Confirmer la suppression
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>

                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                navigate("/admin/purchase-invoices/ocr")
                            }
                            >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Créer via OCR
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>
        </div>
    );
}
