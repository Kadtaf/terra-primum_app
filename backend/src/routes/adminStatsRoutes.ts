import { Router } from "express";
import {
    getOverviewStats,
    getSalesByDay,
    getTopProducts,
    getActiveHours,
    getTopCategories,
    getTopProductsByCategory,
    getRevenueByCategory,
    getRevenueLast6Months,
    getSalesHeatmap,
    getWeeklyHeatmap
} from "../controllers/adminStatsController";
import { authenticate, isAdmin } from "../middleware/auth";


const router = Router();

router.get("/overview", authenticate, isAdmin, getOverviewStats);
router.get("/sales-by-day", authenticate, isAdmin, getSalesByDay);
router.get("/top-products", authenticate, isAdmin, getTopProducts);
router.get("/active-hours", authenticate, isAdmin, getActiveHours);
router.get("/top-categories", authenticate, isAdmin, getTopCategories); 
router.get(
    "/top-products-by-category",
    authenticate,
    isAdmin,
    getTopProductsByCategory,
);
router.get(
    "/revenue-by-category",
    authenticate,
    isAdmin,
    getRevenueByCategory,
);
router.get(
    "/revenue-last-6-months",
    authenticate,
    isAdmin,
    getRevenueLast6Months,
);
router.get(
    "/heatmap-sales", 
    authenticate, 
    isAdmin, 
    getSalesHeatmap,
);
router.get(
    "/heatmap-week", 
    authenticate, 
    isAdmin, 
    getWeeklyHeatmap
);

export default router;