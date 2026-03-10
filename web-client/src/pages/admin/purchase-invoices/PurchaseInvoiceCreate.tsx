import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Supplier {
    id: string;
    name: string;
}

// Types pour la preview OCR
interface ParsedLine {
    label: string;
    quantity: number | null;
    unitPrice: number | null;
    total: number | null;
}

interface ParsedTotals {
    totalHt: number | null;
    totalTtc: number | null;
    netToPay: number | null;
}

export default function PurchaseInvoiceCreate() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierId, setSupplierId] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [totalHt, setTotalHt] = useState("");
    const [totalTtc, setTotalTtc] = useState("");

    const [file, setFile] = useState<File | null>(null);

    // Nouveaux états pour la preview OCR
    const [ocrLines, setOcrLines] = useState<ParsedLine[]>([]);
    const [ocrLoading, setOcrLoading] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/admin/suppliers");
            if (!res.ok) {
                console.error("Erreur HTTP /api/admin/suppliers", res.status);
                return; // on laisse suppliers = []
            }
            const data = await res.json();

            if (Array.isArray(data)) {
                setSuppliers(data);
            } else {
                console.error("Réponse inattendue pour /api/admin/supplier :", data);
            }

        } catch (error) {
            console.error("Erreur chargement fournisseurs :", error);
        }
        };

        fetchSuppliers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let uploadedFileUrl = null;

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
        };

        try {
        const res = await fetch("/api/purchase-invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erreur lors de la création");

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

    // Nouveau : bouton "Pré-remplir via OCR"
    const handleOcrPrefill = async () => {
        if (!file) {
        toast({
            title: "Fichier manquant",
            description: "Sélectionne un PDF ou une image avant de lancer l'OCR.",
            variant: "destructive",
        });
        return;
        }

        try {
        setOcrLoading(true);

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

        // 2) Appel OCR preview
        const ocrRes = await fetch("/api/purchase-invoices/ocr-preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl }),
        });

        if (!ocrRes.ok) {
            throw new Error("Erreur OCR");
        }

        const ocrData = await ocrRes.json();

        const totals: ParsedTotals = ocrData.parsed.totals;
        const lines: ParsedLine[] = ocrData.parsed.lines;

        // 3) Remplir les champs
        if (totals.totalHt != null) {
            setTotalHt(totals.totalHt.toString());
        }
        if (totals.totalTtc != null) {
            setTotalTtc(totals.totalTtc.toString());
        }

        setOcrLines(lines);

        toast({
            title: "Pré-remplissage OCR",
            description: "Les montants et lignes ont été détectés. Vérifie avant de sauvegarder.",
        });
        } catch (error) {
        console.error(error);
        toast({
            title: "Erreur OCR",
            description: "Impossible de pré-remplir la facture.",
            variant: "destructive",
        });
        } finally {
        setOcrLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Créer une facture fournisseur</h1>

        <Card>
            <CardHeader>
            <CardTitle>Informations de la facture</CardTitle>
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
                    {Array.isArray(suppliers) &&
                        suppliers.map((s) => (
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

                {/* Total HT */}
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

                {/* Total TTC */}
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

                {/* Boutons */}
                <div className="flex flex-col md:flex-row gap-2">
                <Button type="submit" className="w-full md:w-auto">
                    Créer la facture
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full md:w-auto"
                    onClick={handleOcrPrefill}
                    disabled={ocrLoading || !file}
                >
                    {ocrLoading ? "Analyse OCR..." : "Pré-remplir via OCR"}
                </Button>
                </div>
            </form>
            </CardContent>
        </Card>

        {/* Preview des lignes OCR */}
        {ocrLines.length > 0 && (
            <Card>
            <CardHeader>
                <CardTitle>Lignes détectées (preview)</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm">
                {ocrLines.map((line, idx) => (
                    <li key={idx} className="border rounded p-2">
                    <div className="font-medium">{line.label}</div>
                    <div className="text-muted-foreground">
                        Qté: {line.quantity ?? "-"} | PU HT:{" "}
                        {line.unitPrice ?? "-"} | Total HT: {line.total ?? "-"}
                    </div>
                    </li>
                ))}
                </ul>
            </CardContent>
            </Card>
        )}
        </div>
    );
}
