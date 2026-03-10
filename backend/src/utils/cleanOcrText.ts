export const cleanOcrText = (raw: string): string => {
    let text = raw;

    // 1) Supprimer les caractères invisibles
    text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");

    // 2) Normaliser les espaces multiples
    text = text.replace(/\s+/g, " ");

    // 3) Corriger les séparateurs décimaux FR → EN
    text = text.replace(/(\d+),(\d{2})/g, "$1.$2");

    // 4) Ajouter des retours à la ligne sur les sections importantes
    text = text.replace(/(total\s*ht|total\s*ttc|net\s*à\s*payer|tva)/gi, "\n$1");

    // 5) Séparer les montants collés (ex: 6075€ → 60.75)
    text = text.replace(/(\d{2})(\d{2})€/g, "$1.$2");

    // 6) Nettoyer les lignes
    text = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 3)
        .join("\n");

    // 7) Fusionner les lignes cassées contenant des montants
    text = text.replace(/(\d)\s+(\d{2,3}\.\d{2})/g, "$1 $2");

    // 8) Nettoyage final
    return text.replace(/\s{2,}/g, " ").trim();
};
