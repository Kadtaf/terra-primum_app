import { Router, Request, Response } from "express";
import { RestaurantSettings } from "../models";

const router = Router();

// Route publique : obtenir les paramètres du restaurant
router.get("/settings", async (req: Request, res: Response) => {
    try {
        const settings = await RestaurantSettings.findOne();

        if (!settings) {
        return res.status(404).json({ error: "Paramètres non trouvés" });
        }

        res.json(settings);
    } catch (error) {
        console.error("Erreur récupération paramètres publics:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des paramètres" });
    }
});

export default router;