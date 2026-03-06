import { groupOcrLinesIntoProducts } from "./groupOcrLinesIntoProducts";

export type ParsedInvoiceLine = {
    label: string;
    quantity: number | null;
    unitPrice: number | null;
    total: number | null;
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

export const parseOcrInvoice = (cleaned: string): ParsedInvoice => {
    const productBlocks: string[] = groupOcrLinesIntoProducts(cleaned);

    const lines: ParsedInvoiceLine[] = [];
    const totals: ParsedInvoiceTotals = {
        totalHt: null,
        totalTtc: null,
        netToPay: null,
    };

    const rows: string[] = cleaned.split("\n");

    // Extraction des totaux
    for (const row of rows) {
        const htMatch = row.match(/Total HT.*?(\d+\.\d{2})/i);
        if (htMatch) totals.totalHt = parseFloat(htMatch[1]);

        const ttcMatch = row.match(/Total TTC.*?(\d+\.\d{2})/i);
        if (ttcMatch) totals.totalTtc = parseFloat(ttcMatch[1]);

        const netMatch = row.match(/Net.?à.?payer.*?(\d+\.\d{2})/i);
        if (netMatch) totals.netToPay = parseFloat(netMatch[1]);
    }

    // Extraction des lignes produits normales
    for (const block of productBlocks) {
        const priceMatches = block.match(/\d+\.\d{2}/g);
        if (!priceMatches) continue;

        const prices = priceMatches.map((p: string) => parseFloat(p));
        const unitPrice = Math.min(...prices);
        const total = Math.max(...prices);

        const qtyMatch = block.match(/\b\d{1,3}\b/);
        const quantity = qtyMatch ? parseInt(qtyMatch[0]) : 1;

        const label = block
        .replace(/\d+\.\d{2}/g, "")
        .replace(/\b\d{1,3}\b/, "")
        .trim();

        lines.push({
        label,
        quantity,
        unitPrice,
        total,
        });
    }

    // Fallback intelligent (Option C)
    if (lines.length === 0) {
        const qtyMatch = cleaned.match(/\b\d{1,3}\b/);
        const quantity = qtyMatch ? parseInt(qtyMatch[0]) : 1;

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
        unitPrice,
        total,
        });
    }

    return { lines, totals };
};
