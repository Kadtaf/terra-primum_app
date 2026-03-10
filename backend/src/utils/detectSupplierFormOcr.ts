import Supplier from "../models/supplier";

const normalize = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

export const detectSupplierFromOcr = async (
    cleaned: string,
    ): Promise<string | null> => {
    const lines = cleaned.split("\n").map((l) => normalize(l));

    const knownSuppliers = [
        "metro",
        "promocash",
        "transgourmet",
        "passion froid",
        "terre azur",
        "pomona",
        "sysco",
        "bridor",
        "delpeyrat",
        "labeyrie",
        "sud ouest frais",
        "soviag",
        "sovico",
    ];

    for (const supplierName of knownSuppliers) {
        const found = lines.find((l) => l.includes(supplierName));
        if (found) {
        const existing = await Supplier.findOne({
            where: { name: supplierName },
        });
        if (existing) return existing.id;

        const created = await Supplier.create({ name: supplierName });
        return created.id;
        }
    }

    const addressHints = [
        { keyword: "bordeaux lac", supplier: "metro" },
        { keyword: "merignac", supplier: "metro" },
        { keyword: "pessac", supplier: "promocash" },
        { keyword: "begles", supplier: "transgourmet" },
        { keyword: "bruges", supplier: "sud ouest frais" },
    ];

    for (const hint of addressHints) {
        const found = lines.find((l) => l.includes(hint.keyword));
        if (found) {
        const existing = await Supplier.findOne({
            where: { name: hint.supplier },
        });
        if (existing) return existing.id;

        const created = await Supplier.create({ name: hint.supplier });
        return created.id;
        }
    }

    const uppercaseLine = cleaned
        .split("\n")
        .map((l) => l.trim())
        .find((l) => /^[A-Z0-9 .,'-]{8,}$/.test(l));

    if (uppercaseLine) {
        const normalizedName = normalize(uppercaseLine);

        const existing = await Supplier.findOne({
        where: { name: normalizedName },
        });
        if (existing) return existing.id;

        const created = await Supplier.create({ name: normalizedName });
        return created.id;
    }

    return null;
};
