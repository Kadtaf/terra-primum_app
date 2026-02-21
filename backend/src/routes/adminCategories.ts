import { Router, Request, Response } from "express";
import { Category } from "../models/Category";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();

// GET - Liste admin
router.get("/", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const categories = await Category.findAll({
        order: [["createdAt", "DESC"]],
        });

        res.json({ success: true, data: categories });
    } catch (error) {
        console.error("Erreur récupération catégories admin:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des catégories" });
    }
});

// POST - Créer
router.post("/", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const category = await Category.create(req.body);

        res.json({ success: true, data: category });
    } catch (error) {
        console.error("Erreur création catégorie admin:", error);
        res.status(500).json({ error: "Erreur lors de la création de la catégorie" });
    }
    });

// PUT - Modifier
router.put("/:id", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        await category.update(req.body);

        res.json({ success: true, data: category });
    } catch (error) {
        console.error("Erreur mise à jour catégorie admin:", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la catégorie" });
    }
    });

    // DELETE - Supprimer
    router.delete("/:id", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        await category.destroy();

        res.json({ success: true, message: "Catégorie supprimée" });
    } catch (error) {
        console.error("Erreur suppression catégorie admin:", error);
        res.status(500).json({ error: "Erreur lors de la suppression de la catégorie" });
    }
});

export default router;