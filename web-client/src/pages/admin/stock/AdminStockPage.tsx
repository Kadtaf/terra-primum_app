import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StockItem {
    productId: string;
    productName: string;
    quantity: string;
    reorderThreshold: string | null;
}

export default function AdminStockPage() {
    const [items, setItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStock = async () => {
        try {
            const res = await fetch("/api/stock");
            if (!res.ok) throw new Error("Erreur chargement stock");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erreur");
        } finally {
            setLoading(false);
        }
        };

        fetchStock();
    }, []);

    return (
        <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Stock des ingrédients</h1>
            <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="bg-black text-white border-black hover:bg-transparent hover:text-black"
            >
            Retour au dashboard
            </Button>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>État du stock</CardTitle>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="flex justify-center py-10">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : items.length === 0 ? (
                <p className="text-muted-foreground">
                Aucun stock à afficher pour le moment.
                </p>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité en stock</TableHead>
                    <TableHead>Seuil d’alerte</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                    <TableRow key={item.productId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>
                        {item.quantity
                            ? Number(item.quantity).toFixed(3)
                            : "0.000"}
                        </TableCell>
                        <TableCell>
                        {item.reorderThreshold
                            ? Number(item.reorderThreshold).toFixed(3)
                            : "-"}
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
