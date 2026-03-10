/**
 * Normalise un label OCR :
 * - minuscules
 * - suppression accents
 * - suppression caractères spéciaux
 * - trim
 */
export const normalizeLabel = (label: string): string =>
    label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim();

/**
 * Détecte l’unité dans une ligne OCR.
 * Retourne null si aucune unité trouvée.
 */
export const guessUnit = (text: string): string | null => {
    const lower = text.toLowerCase();

    if (lower.includes("kg")) return "kg";
    if (lower.includes("g")) return "g";
    if (lower.includes("l")) return "L";
    if (lower.includes("ml")) return "ml";
    if (lower.includes("cl")) return "cl";
    if (lower.includes("unite") || lower.includes("u")) return "unité";
    if (lower.includes("pc") || lower.includes("piece")) return "pc";

    return null;
};
