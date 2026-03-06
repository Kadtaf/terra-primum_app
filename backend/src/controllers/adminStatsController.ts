import { Request, Response } from "express";
import { Order, OrderItem, Product, User } from "../models";
import { Op, fn, col, literal } from "sequelize";
import { Category } from "../models/Category";

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
// 3. Top Categories 
// =========================
export async function getTopCategories(req: Request, res: Response) {
    try {
        const rows = await OrderItem.findAll({
        attributes: [[fn("SUM", col("quantity")), "totalSold"]],
        include: [
            {
            model: Product,
            as: "product",
            attributes: ["id", "category"],
            required: true,
            include: [
                {
                model: Category,
                as: "categoryDetails",
                attributes: ["id", "name"],
                required: true,
                },
            ],
            },
        ],
        group: [
            "product.id",
            "product.category",
            "product->categoryDetails.id",
            "product->categoryDetails.name",
        ],
        order: [[literal('"totalSold"'), "DESC"]],
        });

        // 1) On mappe en structure simple
        const perProduct = rows
        .filter((item: any) => item.product && item.product.categoryDetails)
        .map((item: any) => ({
            categoryId: item.product.categoryDetails.id,
            categoryName: item.product.categoryDetails.name,
            totalSold: Number(item.get("totalSold")),
        }));

        // 2) On réagrège par catégorie
        const byCategory = new Map<
        string,
        { categoryId: string; categoryName: string; totalSold: number }
        >();

        for (const row of perProduct) {
        const existing = byCategory.get(row.categoryId);
        if (existing) {
            existing.totalSold += row.totalSold;
        } else {
            byCategory.set(row.categoryId, { ...row });
        }
        }

        // 3) On retourne un tableau trié
        const result = Array.from(byCategory.values()).sort(
        (a, b) => b.totalSold - a.totalSold,
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Erreur top-categories:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

// =========================
// 4. TOP PRODUCTS
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

// ========================
// 5. Top Products By Category
// ===========================
export async function getTopProductsByCategory(
    req: Request,
    res: Response,
    ) {
    try {
        const rows = await OrderItem.findAll({
        attributes: ["productId", [fn("SUM", col("quantity")), "totalSold"]],
        include: [
            {
            model: Product,
            as: "product",
            attributes: ["id", "name", "category"],
            required: true,
            include: [
                {
                model: Category,
                as: "categoryDetails",
                attributes: ["id", "name"],
                required: true,
                },
            ],
            },
        ],
        group: [
            "OrderItem.productId", 
            "product.id",
            "product.name",
            "product.category",
            "product->categoryDetails.id",
            "product->categoryDetails.name",
        ],
        order: [[literal('"totalSold"'), "DESC"]],
        });

        const perProduct = rows.map((item: any) => ({
        categoryId: item.product.categoryDetails.id,
        categoryName: item.product.categoryDetails.name,
        productId: item.product.id,
        productName: item.product.name,
        totalSold: Number(item.get("totalSold")),
        }));

        const byCategory = new Map<
        string,
        {
            categoryId: string;
            categoryName: string;
            products: {
            productId: string;
            productName: string;
            totalSold: number;
            }[];
        }
        >();

        for (const row of perProduct) {
        if (!byCategory.has(row.categoryId)) {
            byCategory.set(row.categoryId, {
            categoryId: row.categoryId,
            categoryName: row.categoryName,
            products: [],
            });
        }

        byCategory.get(row.categoryId)!.products.push({
            productId: row.productId,
            productName: row.productName,
            totalSold: row.totalSold,
        });
        }

        const result = Array.from(byCategory.values()).map((cat) => ({
        ...cat,
        products: cat.products.sort((a, b) => b.totalSold - a.totalSold),
        }));

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Erreur top-products-by-category:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}


// =========================
// 6. REVENUE LAST 6 MONTHS
// =========================

export async function getRevenueLast6Months(req: Request, res: Response) {
    try {
        const rows = await Order.findAll({
        attributes: [
            
            [
            fn(
                "TO_CHAR",
                fn("DATE_TRUNC", "month", col("createdAt")),
                "MM-YYYY",
            ),
            "month",
            ],
            [fn("SUM", col("totalPrice")), "totalRevenue"],
        ],
        where: {
            createdAt: {
            [Op.gte]: literal(`NOW() - INTERVAL '6 months'`),
            },
        },
        group: [
            fn(
            "TO_CHAR",
            fn("DATE_TRUNC", "month", col("createdAt")),
            "MM-YYYY",
            ),
        ],
        order: [
            [
            fn(
                "TO_CHAR",
                fn("DATE_TRUNC", "month", col("createdAt")),
                "MM-YYYY",
            ),
            "ASC",
            ],
        ],
        });

        // map: "02-2026" -> 216.5
        const map: Record<string, number> = {};
        rows.forEach((row: any) => {
        const key = row.get("month") as string;
        map[key] = Number(row.get("totalRevenue")) || 0;
        });

        // Générer les 6 derniers mois (même format "MM-YYYY")
        const now = new Date();
        const result: { month: string; totalRevenue: number }[] = [];

        for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

        result.push({
            month: key,
            totalRevenue: map[key] || 0,
        });
        }

        return res.json({ success: true, data: result });
    } catch (error) {
        console.error("Erreur getRevenueLast6Months:", error);
        return res.status(500).json({
        success: false,
        message: "Erreur serveur lors du calcul du CA des 6 derniers mois.",
        });
    }
}

//=======================================
// 7. CA Par Category par mois N- 1 et N
//=======================================

export async function getRevenueByCategory(req: Request, res: Response) {
        try {
        const isPrevious = req.query.previous === "true";
    
        // 1️. Déterminer la période
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0 = janvier
    
        const startDate = isPrevious
            ? new Date(year, month - 1, 1)
            : new Date(year, month, 1);
    
        const endDate = isPrevious
            ? new Date(year, month, 1)
            : new Date(year, month + 1, 1);
    
        // 2️. Récupérer les OrderItem filtrés par date
        const rows = await OrderItem.findAll({
            attributes: [
            [fn("SUM", literal("quantity * product.price")), "totalRevenue"],
            ],
            include: [
            {
                model: Product,
                as: "product",
                attributes: ["id", "name", "category", "price"],
                required: true,
                include: [
                {
                    model: Category,
                    as: "categoryDetails",
                    attributes: ["id", "name"],
                    required: false,
                },
                ],
            },
            ],
            where: {
            createdAt: {
                [Op.gte]: startDate,
                [Op.lt]: endDate,
            },
            },
            group: [
            "product.id",
            "product.name",
            "product.category",
            "product.price",
            "product->categoryDetails.id",
            "product->categoryDetails.name",
            ],
            order: [[literal('"totalRevenue"'), "DESC"]],
        });
    
        // 3️. Agrégation par catégorie (inchangée)
        const aggregated = new Map<
            string,
            { categoryId: string; categoryName: string; totalRevenue: number }
        >();
    
        for (const item of rows) {
            const orderItem = item as any;
            const product: any = orderItem.product;
            const category = product?.categoryDetails;
            if (!product || !category) continue;
    
            const categoryId = category.id;
            const categoryName = category.name;
            const revenue = Number(item.get("totalRevenue")) || 0;
    
            const existing = aggregated.get(categoryId);
            if (existing) {
            existing.totalRevenue += revenue;
            } else {
            aggregated.set(categoryId, {
                categoryId,
                categoryName,
                totalRevenue: revenue,
            });
            }
        }
    
        const result = Array.from(aggregated.values()).sort(
            (a, b) => b.totalRevenue - a.totalRevenue
        );
        console.log("REVENUE BY CATEGORY API result =", result);
        res.json({ success: true, data: result });
        } catch (error) {
        console.error("Erreur revenue-by-category:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
        }
}



// =========================
// 8. ACTIVE HOURS
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

// ===========================================================
// 9. HEATMAP Sales jours X heures (mois en cours ou précédent)
// ===========================================================

export async function getSalesHeatmap(req: Request, res: Response) {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0 = janvier

        // Fonction utilitaire pour récupérer une période
        async function fetchHeatmapForPeriod(y: number, m: number) {
        const startDate = new Date(y, m, 1);
        const endDate = new Date(y, m + 1, 1);

        const rows = await Order.findAll({
            attributes: [
            [fn("EXTRACT", literal("DAY FROM \"createdAt\"")), "day"],
            [fn("EXTRACT", literal("HOUR FROM \"createdAt\"")), "hour"],
            [fn("SUM", col("totalPrice")), "total"],
            ],
            where: {
            createdAt: {
                [Op.gte]: startDate,
                [Op.lt]: endDate,
            },
            },
            group: [
            literal(`EXTRACT(DAY FROM "createdAt")`) as any,
            literal(`EXTRACT(HOUR FROM "createdAt")`) as any
            ],
            order: [
            [literal(`EXTRACT(DAY FROM "createdAt")`), "ASC"],
            [literal(`EXTRACT(HOUR FROM "createdAt")`), "ASC"]
            ],
        });

        return rows.map((row: any) => ({
            day: Number(row.get("day")),
            hour: Number(row.get("hour")),
            total: Number(row.get("total")),
        }));
        }

        // 1️. Essayer le mois en cours
        let data = await fetchHeatmapForPeriod(year, month);
        // 2️. Si vide → prendre le mois précédent
        let usedMonth = month;
        let usedYear = year;

        if (data.length === 0) {
        const prevMonth = month - 1;
        const prevYear = prevMonth < 0 ? year - 1 : year;
        const realPrevMonth = prevMonth < 0 ? 11 : prevMonth;

        data = await fetchHeatmapForPeriod(prevYear, realPrevMonth);
        usedMonth = realPrevMonth;
        usedYear = prevYear;
        }

        return res.json({
        success: true,
        period: `${usedYear}-${String(usedMonth + 1).padStart(2, "0")}`,
        data,
        });

    } catch (error) {
        console.error("Erreur getSalesHeatmap:", error);
        return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de la récupération de la heatmap.",
        });
    }
}

// ================================================
// 10. HEATMAP DE LA SEMAINE EN COURS (jour × heure)
// ================================================

export async function getWeeklyHeatmap(req: Request, res: Response) {
    try {
        const now = new Date();

        // Trouver le lundi de la semaine en cours
        const day = now.getDay(); // 0 = dimanche
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const monday = new Date(now);
        monday.setDate(now.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0);

        // Dimanche = lundi + 7 jours
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 7);

        const rows = await Order.findAll({
        attributes: [
            [fn("EXTRACT", literal("DOW FROM \"createdAt\"")), "day"],   // 0 = dimanche
            [fn("EXTRACT", literal("HOUR FROM \"createdAt\"")), "hour"], // 0–23
            [fn("SUM", col("totalPrice")), "total"],
        ],
        where: {
            createdAt: {
            [Op.gte]: monday,
            [Op.lt]: sunday,
            },
        },
        group: [
            literal(`EXTRACT(DOW FROM "createdAt")`) as any,
            literal(`EXTRACT(HOUR FROM "createdAt")`) as any
        ],
        order: [
            [literal(`EXTRACT(DOW FROM "createdAt")`), "ASC"],
            [literal(`EXTRACT(HOUR FROM "createdAt")`), "ASC"]
        ],
        });

        const data = rows.map((row: any) => ({
        day: Number(row.get("day")),   // 0 = dimanche
        hour: Number(row.get("hour")),
        total: Number(row.get("total")),
        }));

        return res.json({
        success: true,
        weekStart: monday.toISOString().split("T")[0],
        weekEnd: sunday.toISOString().split("T")[0],
        data,
        });

    } catch (error) {
        console.error("Erreur getWeeklyHeatmap:", error);
        return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de la récupération de la heatmap hebdomadaire.",
        });
    }
    }