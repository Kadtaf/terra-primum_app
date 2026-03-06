export const cleanOcrText = (raw: string): string => {
    let text = raw;

    // 1) Supprimer les caractères invisibles / parasites
    text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");

    // 2) Normaliser les espaces multiples
    text = text.replace(/\s+/g, " ");

    // 3) Remettre des retours à la ligne sur les zones importantes
    text = text.replace(/(Total HT|Total TTC|Net à payer|TVA)/gi, "\n$1");

    // 4) Corriger les séparateurs décimaux (ex: 203,00 → 203.00)
    text = text.replace(/(\d+),(\d{2})/g, "$1.$2");

    // 5) Supprimer les lignes trop courtes ou inutiles
    text = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 3)
        .join("\n");

    // 6) Fusionner les lignes cassées contenant des montants
    text = text.replace(/(\d)\s+(\d{2,3}\.\d{2})/g, "$1 $2");

    // 7) Nettoyage final des espaces
    text = text.replace(/\s{2,}/g, " ").trim();

    // 8) Corriger les montants collés du type 6075€ → 60.75
    text = text.replace(/(\d{2})(\d{2})€/g, "$1.$2");

    return text;
};
