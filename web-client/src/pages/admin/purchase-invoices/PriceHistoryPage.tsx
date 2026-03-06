import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Pour le graphique, on va utiliser recharts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Supplier {
    id: string;
    name: string;
}

interface PriceHistoryItem {
    invoiceId: string;
    invoiceDate: string;
    supplierId: string;
    productNameRaw: string;
    quantity: string;
    unit: string;
    unitPriceHt: string;
    totalPriceHt: string;
    vatRate: string;
}

export default function PriceHistoryPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [productQuery, setProductQuery] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const navigate = useNavigate();

    const [data, setData] = useState<PriceHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();

    // 1) Charger la liste des fournisseurs pour le select
    useEffect(() => {
        const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/admin/suppliers");
            const json = await res.json();
            if (Array.isArray(json)) {
            setSuppliers(json);
            }
        } catch (error) {
            console.error("Erreur chargement fournisseurs :", error);
        }
        };

        fetchSuppliers();
    }, []);

    // 2) Charger l'historique quand on clique sur "Rechercher"
    const fetchHistory = async () => {
        if (!selectedSupplierId) {
        toast({
            title: "Fournisseur manquant",
            description: "Merci de sélectionner un fournisseur.",
            variant: "destructive",
        });
        return;
        }

        setLoading(true);

        try {
        const params = new URLSearchParams();
        params.set("supplierId", selectedSupplierId);
        if (productQuery.trim()) {
            params.set("product", productQuery.trim());
        }
        if (fromDate) {
            params.set("fromDate", fromDate);
        }
        if (toDate) {
            params.set("toDate", toDate);
        }

        const res = await fetch(
            `/api/purchase-invoices/price-history?${params.toString()}`,
        );
        if (!res.ok) {
            throw new Error("Erreur API historique");
        }

        const json = await res.json();
        setData(Array.isArray(json) ? json : []);

        if (!Array.isArray(json) || json.length === 0) {
            toast({
            title: "Aucun résultat",
            description:
                "Aucune ligne trouvée pour ces filtres. Essaie d'élargir la recherche.",
            });
        }
        } catch (error) {
        console.error(error);
        toast({
            title: "Erreur",
            description: "Impossible de récupérer l'historique des prix.",
            variant: "destructive",
        });
        } finally {
        setLoading(false);
        }
    };

    // 3) Préparer les données pour le graphique
    const chartData = data
        .slice()
        .sort(
        (a, b) =>
            new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime(),
        )
        .map((item) => ({
        date: item.invoiceDate,
        // prix unitaire HT en nombre
        unitPrice: parseFloat(item.unitPriceHt),
        }));

        const productTitle =
            productQuery.trim() ||
            (data[0]?.productNameRaw
                ? data[0].productNameRaw.substring(0, 50) + "..."
                : "");


    return (
        <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold">Historique des prix</h1>

            {/* Filtres */}
            <Card>
                <CardHeader>
                <CardTitle>Filtres</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Fournisseur */}
                    <div>
                    <label className="block mb-1 font-medium">Fournisseur</label>
                    <select
                        className="w-full border rounded p-2"
                        value={selectedSupplierId}
                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                    >
                        <option value="">Sélectionner un fournisseur</option>
                        {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Produit (texte) */}
                    <div>
                    <label className="block mb-1 font-medium">Produit (texte)</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Ex : CARTOUCHE, Casserole..."
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                    />
                    </div>

                    {/* Date début */}
                    <div>
                    <label className="block mb-1 font-medium">Date de début</label>
                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    </div>

                    {/* Date fin */}
                    <div>
                    <label className="block mb-1 font-medium">Date de fin</label>
                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                    </div>
                </div>

                <div className="mt-4">
                <Button
                onClick={fetchHistory}
                disabled={loading}
                className="bg-black text-white border-black hover:bg-amber-400 hover:text-black"
                >
                {loading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recherche...
                    </>
                ) : (
                    "Rechercher"
                )}
                </Button>

                </div>
                </CardContent>
            </Card>

            {/* Graphique */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {productTitle
                            ? `Évolution du prix unitaire HT — ${productTitle}`
                            : "Évolution du prix unitaire HT"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                {chartData.length === 0 ? (
                    <p className="text-muted-foreground">
                    Aucun point à afficher. Lance une recherche pour voir le
                    graphique.
                    </p>
                ) : (
                    <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis
                        tickFormatter={(value) => `${value.toFixed(2)} €`}
                        />
                        <Tooltip
                        formatter={(value: any) =>
                            `${Number(value).toFixed(2)} €`
                        }
                        />

                        <Line
                            type="monotone"
                            dataKey="unitPrice"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                )}
                </CardContent>
            </Card>

            {/* Tableau */}
            <Card>
                <CardHeader>
                <CardTitle>Tableau des lignes</CardTitle>
                </CardHeader>
                <CardContent>
                {loading ? (
                    <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-muted-foreground">Aucune donnée à afficher.</p>
                ) : (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Unité</TableHead>
                        <TableHead>PU HT</TableHead>
                        <TableHead>Total HT</TableHead>
                        <TableHead>TVA</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row) => (
                        <TableRow key={`${row.invoiceId}-${row.productNameRaw}`}>
                            <TableCell>{row.invoiceDate}</TableCell>
                            <TableCell>{row.productNameRaw}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>
                            {row.unitPriceHt
                                ? `${Number(row.unitPriceHt).toFixed(2)} €`
                                : "-"}
                            </TableCell>
                            <TableCell>
                            {row.totalPriceHt
                                ? `${Number(row.totalPriceHt).toFixed(2)} €`
                                : "-"}
                            </TableCell>

                            <TableCell>{row.vatRate}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                )}
                </CardContent>
            </Card>
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => navigate("/admin")}
                    className="bg-black text-white border-black hover:bg-amber-400 hover:text-black"
                >
                    Retour au dashboard
                </Button>
            </div>
        </div>
    );
}
