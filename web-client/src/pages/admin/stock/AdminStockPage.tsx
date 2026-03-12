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
    ingredientId: string | null;
    ingredientName: string;
    category: string | null;
    unit: string;
    quantity: string;
    reorderThreshold: string | null;
    vatRate: string | null;
    productId: string | null;
    productName: string | null;
}

const CATEGORY_OPTIONS = [
    { value: "", label: "Toutes les catégories" },
    { value: "fruits_legumes", label: "Fruits & légumes" },
    { value: "laitiers", label: "Produits laitiers" },
    { value: "epicerie", label: "Épicerie" },
    { value: "viandes", label: "Viandes" },
    { value: "poisson", label: "Poisson" },
    { value: "alcool", label: "Alcool" },
    { value: "boissons", label: "Boissons" },
    { value: "divers", label: "Divers" },
];

export default function AdminStockPage() {
    const [items, setItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStock = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (categoryFilter) {
            params.set("category", categoryFilter);
            }

            const res = await fetch(`/api/stock?${params.toString()}`);
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
    }, [categoryFilter]);

    return (
        <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold">Stock des matières premières</h1>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <select
                className="border rounded-md px-3 py-2 text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                </option>
                ))}
            </select>

            <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="bg-black text-white border-black hover:bg-amber-400 hover:text-black md:ml-2"
            >
                Retour au dashboard
            </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>État du stock des matières premières</CardTitle>
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
                    <TableHead>Ingrédient</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Seuil d’alerte</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow
                        key={`${item.ingredientId ?? "no-ingredient"}-${item.productId ?? index}`}
                        >
                        <TableCell>{item.ingredientName}</TableCell>
                        <TableCell>{item.category ?? "-"}</TableCell>
                        <TableCell>
                            {item.quantity ? Number(item.quantity).toFixed(3) : "0.000"}
                        </TableCell>
                        <TableCell>{item.unit || "-"}</TableCell>
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
