import { Router, Request, Response } from "express";
import StockItem from "../models/StockItem";
import { Product } from "../models/index";
import Ingredient from "../models/Ingredient";

const router = Router();

/**
 * GET /api/stock
 * Retourne la liste des ingrédients avec leur stock actuel,
 * éventuellement filtrée par catégorie (?category=fruits_legumes, etc.).
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { category } = req.query;

        const include: any[] = [
        {
            model: Ingredient,
            as: "ingredientData",
            attributes: ["id", "name", "category", "unit", "vatRate"],
            required: false,
        },
        {
            model: Product,
            as: "product",
            attributes: ["id", "name"],
            required: false,
        },
        ];

        if (category && typeof category === "string") {
        include[0].where = { category };
        include[0].required = true;
        }

        const items = await StockItem.findAll({
        include,
        order: [
            [{ model: Ingredient, as: "ingredientData" }, "name", "ASC"],
            [{ model: Product, as: "product" }, "name", "ASC"],
        ],
        });

        const data = items.map((item: any) => ({
        ingredientId: item.ingredientId,
        ingredientName:
            item.ingredientData?.name ?? item.product?.name ?? "Ingrédient inconnu",
        category: item.ingredientData?.category ?? null,
        unit: item.ingredientData?.unit ?? "",
        quantity: item.quantity,
        reorderThreshold: item.reorderThreshold,
        vatRate: item.ingredientData?.vatRate ?? null,
        productId: item.productId,
        productName: item.product?.name ?? null,
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
