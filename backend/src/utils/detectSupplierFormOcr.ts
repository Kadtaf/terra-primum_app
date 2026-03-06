import Supplier from "../models/supplier";

export const detectSupplierFromOcr = async (cleaned: string): Promise<string | null> => {
    const lines = cleaned.split("\n").map(l => l.trim());

    // 1. Liste de fournisseurs connus
    const knownSuppliers = [
        "EASY CARTOUCHE",
        "OPTICAL CENTER",
        "AMAZON",
        "FNAC",
        "BUREAU VALLEE",
        "CARREFOUR",
        "LECLERC",
        "INTERMARCHE",
        "CASTORAMA",
        "LEROY MERLIN",
        "METRO",
        "PROMO CASH"
    ];

    for (const supplierName of knownSuppliers) {
        const found = lines.find(l => l.toUpperCase().includes(supplierName));
        if (found) {
            const existing = await Supplier.findOne({ where: { name: supplierName } });
            if (existing) return existing.id;

            const created = await Supplier.create({ name: supplierName });
            return created.id;
        }
    }

    // 2. Lignes en MAJUSCULES (souvent le nom du fournisseur)
    const uppercaseLine = lines.find(l => /^[A-Z0-9 .,'-]{8,}$/.test(l));
    if (uppercaseLine) {
        const existing = await Supplier.findOne({ where: { name: uppercaseLine } });
        if (existing) return existing.id;

        const created = await Supplier.create({ name: uppercaseLine });
        return created.id;
    }

    // 3. Aucun fournisseur détecté
    return null;
};