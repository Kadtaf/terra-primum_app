import { Router, Request, Response } from "express";
import { Category } from "../models/Category";
import { isAdmin } from "../middleware/auth";

const router = Router();

// GET - Liste des catégories
router.get("/", async (req: Request, res: Response) => {
    try {
        const categories = await Category.findAll({
        order: [["name", "ASC"]],
        });

        res.json(categories);
    } catch (error) {
        console.error("Erreur récupération catégories:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des catégories" });
    }
});

// POST - Créer une catégorie (admin)
router.post("/", isAdmin, async (req: Request, res: Response) => {
    try {
        const { id, name, description } = req.body;

        const category = await Category.create({ id, name, description });

        res.status(201).json(category);
    } catch (error) {
        console.error("Erreur création catégorie:", error);
        res.status(500).json({ error: "Erreur lors de la création de la catégorie" });
    }
});

// PUT - Modifier une catégorie (admin)
router.put("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        await category.update(req.body);

        res.json(category);
    } catch (error) {
        console.error("Erreur mise à jour catégorie:", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la catégorie" });
    }
    });

    // DELETE - Supprimer une catégorie (admin)
    router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        await category.destroy();

        res.json({ message: "Catégorie supprimée" });
    } catch (error) {
        console.error("Erreur suppression catégorie:", error);
        res.status(500).json({ error: "Erreur lors de la suppression de la catégorie" });
    }
});

export default router;