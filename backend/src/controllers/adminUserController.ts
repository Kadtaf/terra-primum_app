import { Request, Response } from "express";
import { User, Order } from "../models";

// =========================
// 1. LISTE DES UTILISATEURS
// =========================
export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await User.findAll({
        attributes: ["id", "email", "role", "isActive", "createdAt"],
        order: [["createdAt", "DESC"]],
        });

        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

// =========================
// 2. MODIFIER LE RÔLE
// =========================
export async function updateUserRole(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ success: false, message: "Rôle invalide" });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

        user.role = role;
        await user.save();

        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

// =========================
// 3. ACTIVER / DÉSACTIVER UN COMPTE
// =========================
export async function toggleUserStatus(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

        user.isActive = !user.isActive;
        await user.save();

        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}