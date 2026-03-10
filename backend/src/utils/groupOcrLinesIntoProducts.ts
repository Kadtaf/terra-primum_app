export const groupOcrLinesIntoProducts = (cleaned: string): string[] => {
    const rows = cleaned
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

    const productBlocks: string[] = [];
    let currentBlock: string[] = [];

    const hasPrice = (line: string) =>
        /\d+[.,]\d{2}/.test(line) || /\d{2,4}€/.test(line);

    const hasQuantity = (line: string) =>
        /\b\d{1,3}(?:[.,]\d{1,3})?\b/.test(line);

    const hasFoodKeyword = (line: string) =>
        /(kg|g|l|ml|viande|poisson|tomate|creme|lait|oeuf|fruit|legume|fromage|beurre|farine|huile)/i.test(
        line,
        );

    const isNoise = (line: string) =>
        /(adresse|facture|commande|livraison|total|tva|page|siret|iban|tel|email)/i.test(
        line,
        );

    const isProductLine = (line: string) =>
        !isNoise(line) &&
        (hasPrice(line) || hasQuantity(line) || hasFoodKeyword(line));

    for (const row of rows) {
        if (isProductLine(row)) {
        currentBlock.push(row);
        } else {
        if (currentBlock.length > 0) {
            productBlocks.push(currentBlock.join(" "));
            currentBlock = [];
        }
        }
    }

    if (currentBlock.length > 0) {
        productBlocks.push(currentBlock.join(" "));
    }

    return productBlocks;
};
