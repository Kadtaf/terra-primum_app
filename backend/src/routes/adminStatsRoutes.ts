import { Router } from "express";
import {
    getOverviewStats,
    getSalesByDay,
    getTopProducts,
    getActiveHours,
} from "../controllers/adminStatsController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();

router.get("/overview", authenticate, isAdmin, getOverviewStats);
router.get("/sales-by-day", authenticate, isAdmin, getSalesByDay);
router.get("/top-products", authenticate, isAdmin, getTopProducts);
router.get("/active-hours", authenticate, isAdmin, getActiveHours);

export default router;