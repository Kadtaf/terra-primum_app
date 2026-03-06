import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Supplier {
    id: string;
    name: string;
}

export default function PurchaseInvoiceOcrCreate() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierId, setSupplierId] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/admin/suppliers");
            const data = await res.json();
            setSuppliers(data);
        } catch (error) {
            console.error("Erreur chargement fournisseurs :", error);
        }
        };
        fetchSuppliers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
        toast({
            title: "Fichier manquant",
            description: "Merci de sélectionner un PDF ou une image.",
            variant: "destructive",
        });
        return;
        }

        setLoading(true);

        try {
        // 1) Upload du fichier
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/purchase-invoices/upload", {
            method: "POST",
            body: formData,
        });

        if (!uploadRes.ok) {
            throw new Error("Erreur upload fichier");
        }

        const uploadData = await uploadRes.json();
        const fileUrl = uploadData.fileUrl as string;

        // 2) Appel OCR
        const ocrRes = await fetch("/api/purchase-invoices/ocr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            fileUrl,
            // supplierId est optionnel : s'il est vide, le backend tentera de le détecter
            supplierId: supplierId || null,
            }),
        });

        if (!ocrRes.ok) {
            throw new Error("Erreur OCR");
        }

        const ocrData = await ocrRes.json();
        // ocrData.invoice contient la facture créée par le backend
        const invoiceId = ocrData.invoice?.id;

        toast({
            title: "Facture créée via OCR",
            description:
            "La facture et ses lignes ont été générées automatiquement.",
        });

        if (invoiceId) {
            navigate(`/admin/purchase-invoices/${invoiceId}`);
        } else {
            navigate("/admin/purchase-invoices");
        }
        } catch (error) {
        console.error(error);
        toast({
            title: "Erreur",
            description: "Une erreur est survenue lors du traitement OCR.",
            variant: "destructive",
        });
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Créer une facture (OCR)</h1>

        <Card>
            <CardHeader>
            <CardTitle>Upload & reconnaissance</CardTitle>
            </CardHeader>

            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fournisseur optionnel */}
                <div>
                <label className="block mb-1 font-medium">
                    Fournisseur (optionnel)
                </label>
                <select
                    className="w-full border rounded p-2"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                >
                    <option value="">
                    Laisser vide pour détection automatique
                    </option>
                    {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                    ))}
                </select>
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
                    required
                />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Traitement en cours..." : "Lancer l'OCR"}
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}
