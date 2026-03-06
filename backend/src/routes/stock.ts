import { Router, Request, Response } from "express";
import StockItem from "../models/StockItem";
import { Product } from "../models/index";

const router = Router();

/**
 * GET /api/stock
 * Retourne la liste des produits avec leur stock actuel.
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const items = await StockItem.findAll({
        include: [
            {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price"],
            },
        ],
        order: [[{ model: Product, as: "product" }, "name", "ASC"]],
        });

        const data = items.map((item: any) => ({
        productId: item.productId,
        productName: item.product?.name ?? "Produit inconnu",
        quantity: item.quantity,
        reorderThreshold: item.reorderThreshold,
        }));

        return res.json(data);
    } catch (error) {
        console.error("Erreur récupération stock :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la récupération du stock." });
    }
});

export default router;
