import { Request, Response } from "express";
import { Order, OrderItem, Product, User } from "../models";
import { Op, fn, col, literal } from "sequelize";

// =========================
// 1. OVERVIEW
// =========================
export async function getOverviewStats(req: Request, res: Response) {
    try {
        const totalOrders = await Order.count();
        const totalUsers = await User.count();

        const revenueResult = await Order.findOne({
        attributes: [[fn("SUM", col("totalPrice")), "totalRevenue"]],
        });

        const totalRevenue = Number(revenueResult?.get("totalRevenue") || 0);

        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        res.json({
        success: true,
        data: {
            totalOrders,
            totalUsers,
            totalRevenue,
            averageOrderValue,
        },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

// =========================
// 2. SALES BY DAY
// =========================
export async function getSalesByDay(req: Request, res: Response) {
    try {
        const sales = await Order.findAll({
        attributes: [
            [fn("DATE", col("createdAt")), "date"],
            [fn("SUM", col("totalPrice")), "total"],
        ],
        group: [fn("DATE", col("createdAt"))],
        order: [[fn("DATE", col("createdAt")), "ASC"]],
        });

        res.json({ success: true, data: sales });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
    }

    // =========================
    // 3. TOP PRODUCTS
    // =========================
    export async function getTopProducts(req: Request, res: Response) {
    try {
        const topProducts = await OrderItem.findAll({
        attributes: [
            "productId",
            [fn("SUM", col("quantity")), "totalSold"],
        ],
        include: [
            {
            model: Product,
            as: "product",
            attributes: ["name"],
            },
        ],
        group: ["productId", "product.id"],
        order: [[literal('"totalSold"'), "DESC"]],
        limit: 10,
        });

        res.json({ success: true, data: topProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
    }

    // =========================
    // 4. ACTIVE HOURS
    // =========================
    export async function getActiveHours(req: Request, res: Response) {
    try {
        const hours = await Order.findAll({
        attributes: [
            [fn("EXTRACT", literal("HOUR FROM \"createdAt\"")), "hour"],
            [fn("COUNT", "*"), "count"],
        ],
        group: [fn("EXTRACT", literal("HOUR FROM \"createdAt\""))],
        order: [[literal("hour"), "ASC"]],
        });

        res.json({ success: true, data: hours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}