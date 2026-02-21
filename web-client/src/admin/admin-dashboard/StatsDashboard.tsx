import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
    getStatsOverview,
    getSalesByDay,
    getTopProducts,
    getActiveHours,
} from "@/services/statsService";

import StatsOverview from "./StatsOverview";
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";
import ActiveHoursChart from "./ActiveHoursChart";

interface StatsOverviewData {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    averageOrderValue: number;
}

interface SalesByDay {
    date: string;
    total: number;
}

interface TopProduct {
    productId: string;
    name: string;
    totalSold: number;
    revenue: number;
}

interface ActiveHour {
    hour: number;
    count: number;
}
// Page principale du dashboard admin affichant les différentes statistiques du restaurant
export default function StatsDashboard() {
    const token = useAuthStore.getState().token;

    const [overview, setOverview] = useState<StatsOverviewData | null>(null);
    const [salesByDay, setSalesByDay] = useState<SalesByDay[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [activeHours, setActiveHours] = useState<ActiveHour[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchStats = async () => {
        try {
            const [ov, sales, top, hours] = await Promise.all([
            getStatsOverview(token),
            getSalesByDay(token),
            getTopProducts(token),
            getActiveHours(token),
            ]);

            setOverview(ov);
            setSalesByDay(sales);
            setTopProducts(top);
            setActiveHours(hours);
        } catch (err) {
            console.error("Erreur lors du chargement des statistiques :", err);
            setError("Impossible de charger les statistiques.");
        }
        };

        fetchStats();
    }, [token]);

    if (error) {
        return (
        <div className="text-center py-8 text-red-600">
            {error}
        </div>
        );
    }

    if (!overview) {
        return (
        <div className="text-center py-8">
            Chargement des statistiques...
        </div>
        );
    }

    return (
        <div className="space-y-10">
        <h1 className="text-3xl font-bold">Statistiques du Restaurant</h1>

        <StatsOverview data={overview} />

        <SalesChart data={salesByDay} />

        <TopProducts data={topProducts} />

        <ActiveHoursChart data={activeHours} />
        </div>
    );
}