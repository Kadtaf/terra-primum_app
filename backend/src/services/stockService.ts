import { Transaction, Op } from "sequelize";
import PurchaseInvoiceLine from "../models/PurchaseInvoiceLine";
import StockItem from "../models/StockItem";
import { sequelize } from "../config/database";

/**
 * Applique les entrées de stock d'une facture fournisseur.
 * Pour chaque ligne avec productId renseigné,
 * ajoute la quantity au StockItem correspondant.
 */
export async function applyInvoiceToStock(invoiceId: string) {
    return await sequelize.transaction(async (t: Transaction) => {
        const lines = await PurchaseInvoiceLine.findAll({
        where: {
            invoiceId,
            productId: { [Op.ne]: null },
        },
        transaction: t,
        });

        for (const line of lines) {
        const productId = line.productId as string;
        const qty = Number(line.quantity);

        // Récupérer ou créer la ligne de stock
        const [stock, created] = await StockItem.findOrCreate({
            where: { productId },
            defaults: {
            quantity: qty,
            reorderThreshold: null,
            },
            transaction: t,
        });

        if (!created) {
            const currentQty = Number(stock.quantity);
            const newQty = currentQty + qty;

            await stock.update({ quantity: newQty }, { transaction: t });
        }
        }
    });
}
