import { Router, Request, Response } from "express";
import Ingredient from "../models/Ingredient";

const router = Router();

/**
 * GET /api/ingredients
 * Optionnel: ?search=tom
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        const where: any = {};
        if (search && typeof search === "string" && search.trim() !== "") {
        where.name = { $iLike: `%${search.trim()}%` }; // si tu as opérateurs configurés
        }

        const ingredients = await Ingredient.findAll({
        where,
        order: [["name", "ASC"]],
        });

        const data = ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        category: ing.category,
        unit: ing.unit,
        vatRate: ing.vatRate,
        }));

        return res.json(data);
    } catch (error) {
        console.error("Erreur récupération ingrédients :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des ingrédients." });
    }
});

export default router;
