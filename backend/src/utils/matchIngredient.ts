import { Op, fn, col, where } from "sequelize";
import Ingredient from "../models/Ingredient";

const normalize = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

/**
 * Matching automatique d’un ingrédient à partir d’un label OCR.
 * Retourne l’ID de l’ingrédient ou null si aucun match fiable.
 */
export const matchIngredient = async (
    label: string,
    ): Promise<string | null> => {
    try {
        const normalized = normalize(label);

        // 1. Recherche exacte (unaccent)
        const exactMatch = await Ingredient.findOne({
        where: where(fn("unaccent", col("name")), {
            [Op.iLike]: `%${normalized}%`,
        }),
        });

        if (exactMatch) return exactMatch.id;

        // 2. Recherche fuzzy sur les mots du label
        const words = normalized.split(" ").filter((w) => w.length > 3);

        if (words.length > 0) {
        const fuzzyMatch = await Ingredient.findOne({
            where: {
            name: {
                [Op.iLike]: {
                [Op.any]: words.map((w) => `%${w}%`),
                },
            },
            },
        });

        if (fuzzyMatch) return fuzzyMatch.id;
        }

        // 3. Aucun match fiable
        return null;
    } catch (err) {
        console.error("Erreur matchIngredient :", err);
        return null;
    }
};
