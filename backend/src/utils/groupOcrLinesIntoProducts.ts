    export const groupOcrLinesIntoProducts = (cleaned: string): string[] => {
    const rows = cleaned
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

    const productBlocks: string[] = [];
    let currentBlock: string[] = [];

    const hasReference = (line: string) =>
        /[A-Za-z0-9]{5,}/.test(line) && !/total|tva|ht|ttc/i.test(line);

    const hasDesignation = (line: string) =>
        line.split(" ").length > 4 &&
        /cartouche|pack|lot|verre|optique|ink|toner|lens|cable|adaptateur|generic|générique/i.test(
        line,
        );

    const hasQuantity = (line: string) => /\b\d{1,3}\b/.test(line);

    const hasPrice = (line: string) =>
        /\d+\.\d{2}/.test(line) || /\d{3,4}€/.test(line);

    const isNoise = (line: string) =>
        /adresse|facture|commande|livraison|référence client|total ht|total ttc|tva|page|easy|boulevard|rcs|ape/i.test(
        line,
        );

    const isProductLine = (line: string) =>
        !isNoise(line) &&
        (hasReference(line) ||
        hasDesignation(line) ||
        hasQuantity(line) ||
        hasPrice(line));

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
