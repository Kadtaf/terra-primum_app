import { groupOcrLinesIntoProducts } from "./groupOcrLinesIntoProducts";

export type ParsedInvoiceLine = {
    label: string;
    quantity: number | null;
    unit: string | null;
    unitPrice: number | null;
    total: number | null;
    confidence?: number | null;
};

export type ParsedInvoiceTotals = {
    totalHt: number | null;
    totalTtc: number | null;
    netToPay: number | null;
};

export type ParsedInvoice = {
    lines: ParsedInvoiceLine[];
    totals: ParsedInvoiceTotals;
};

const normalizeNumber = (value: string): number => {
    return parseFloat(value.replace(",", "."));
};

const extractUnit = (text: string): string | null => {
    const units = ["kg", "g", "l", "ml", "unité", "u", "pc"];
    for (const u of units) {
        if (text.toLowerCase().includes(u)) return u;
    }
    return null;
};

export const parseOcrInvoice = (cleaned: string): ParsedInvoice => {
    const productBlocks: string[] = groupOcrLinesIntoProducts(cleaned);

    const lines: ParsedInvoiceLine[] = [];
    const totals: ParsedInvoiceTotals = {
        totalHt: null,
        totalTtc: null,
        netToPay: null,
    };

    const rows: string[] = cleaned.split("\n");

    // -----------------------------
    // 1. Extraction des totaux
    // -----------------------------
    for (const row of rows) {
        const htMatch = row.match(/total\s*ht.*?(\d+[.,]\d{2})/i);
        if (htMatch) totals.totalHt = normalizeNumber(htMatch[1]);

        const ttcMatch = row.match(/total\s*ttc.*?(\d+[.,]\d{2})/i);
        if (ttcMatch) totals.totalTtc = normalizeNumber(ttcMatch[1]);

        const netMatch = row.match(/net.?à.?payer.*?(\d+[.,]\d{2})/i);
        if (netMatch) totals.netToPay = normalizeNumber(netMatch[1]);
    }

    // -----------------------------
    // 2. Extraction des lignes produits
    // -----------------------------
    for (const block of productBlocks) {
        const priceMatches = block.match(/\d+[.,]\d{2}/g);
        if (!priceMatches) continue;

        const prices = priceMatches.map((p: string) => normalizeNumber(p));

        const unitPrice = Math.min(...prices);
        const total = Math.max(...prices);

        // Quantité
        const qtyMatch = block.match(/\b\d{1,3}(?:[.,]\d{1,3})?\b/);
        const quantity = qtyMatch ? normalizeNumber(qtyMatch[0]) : 1;

        // Unité
        const unit = extractUnit(block);

        // Label nettoyé
        const label = block
        .replace(/\d+[.,]\d{2}/g, "")
        .replace(/\b\d{1,3}(?:[.,]\d{1,3})?\b/, "")
        .trim();

        lines.push({
        label,
        quantity,
        unit,
        unitPrice,
        total,
        confidence: 0.85,
        });
    }

    // -----------------------------
    // 3. Fallback intelligent
    // -----------------------------
    if (lines.length === 0) {
        const qtyMatch = cleaned.match(/\b\d{1,3}(?:[.,]\d{1,3})?\b/);
        const quantity = qtyMatch ? normalizeNumber(qtyMatch[0]) : 1;

        const total = totals.totalHt ?? totals.totalTtc ?? null;

        const bestLabel =
        cleaned
            .split("\n")
            .filter((l: string) => l.length > 20)
            .sort((a: string, b: string) => b.length - a.length)[0] ||
        "Produit non identifié";

        const unitPrice =
        total && quantity ? parseFloat((total / quantity).toFixed(2)) : null;

        lines.push({
        label: `Ligne produit (OCR) — ${bestLabel}`,
        quantity,
        unit: null,
        unitPrice,
        total,
        confidence: 0.5,
        });
    }

    return { lines, totals };
};
