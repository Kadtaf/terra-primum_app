import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
    getStatsOverview,
    getSalesByDay,
    getTopProducts,
    getActiveHours,
    getTopCategories,
    getTopProductsByCategory,
    getRevenueByCategory,
    getRevenueLast6Months,
    getSalesHeatmap,
    getWeeklyHeatmap,
} from "@/services/statsService";

import StatsOverview from "./StatsOverview";
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";
import ActiveHoursChart from "./ActiveHoursChart";
import TopCategories from "./TopCategories";
import TopProductsByCategory from "./TopProductsByCategory";
import RevenueByCategoryDonut from "./RevenueByCategoryDonut";
import MonthlyForecastCard from "@/components/dashboard/MonthlyForecastCard";
import { RevenueLastMonths } from "@/types/RevenueLastMonths";
import RevenueLast6MonthsChart from "@/components/dashboard/RevenueLast6MonthsChart";
import { HeatmapPoint } from "@/types/HeatmapPoint";
import SalesHeatmap from "@/components/dashboard/SalesHeatmap";
import WeeklyHeatmap from "@/components/dashboard/WeeklyHeatmap";
import { WeeklyHeatmapPoint } from "@/types/WeeklyHeatmapPoint";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Home, TrendingUp, Package, PieChart } from "lucide-react";

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
    totalSold: number;
    product: {
        name: string;
    };
}

interface ActiveHour {
    hour: number;
    count: number;
}

interface TopCategory {
    categoryId: string;
    categoryName: string;
    totalSold: number;
}

interface TopProductsByCategory {
    categoryId: string;
    categoryName: string;
    products: {
        productId: string;
        productName: string;
        totalSold: number;
    }[];
}

interface RevenueByCategory {
    categoryId: string;
    categoryName: string;
    totalRevenue: number;
}

export default function StatsDashboard() {
    const token = useAuthStore.getState().token;

    const [overview, setOverview] = useState<StatsOverviewData | null>(null);
    const [salesByDay, setSalesByDay] = useState<SalesByDay[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [activeHours, setActiveHours] = useState<ActiveHour[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
    const [topProductsByCategory, setTopProductsByCategory] = useState<
        TopProductsByCategory[]
    >([]);
    const [revenueByCategory, setRevenueByCategory] = useState<
        RevenueByCategory[]
    >([]);
    const [previousRevenueByCategory, setPreviousRevenueByCategory] = useState<
        RevenueByCategory[]
    >([]);
    const [revenueLast6Months, setRevenueLast6Months] = useState<
        RevenueLastMonths[]
    >([]);
    const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
    const [heatmapPeriod, setHeatmapPeriod] = useState("");
    const [weeklyHeatmap, setWeeklyHeatmap] = useState<WeeklyHeatmapPoint[]>([]);
    const [weekStart, setWeekStart] = useState<string>("");
    const [weekEnd, setWeekEnd] = useState<string>("");

    useEffect(() => {
        if (!token) return;

        const fetchStats = async () => {
        try {
            const [
            ov,
            sales,
            top,
            hours,
            categories,
            topByCat,
            revenueCurrent,
            revenuePrevious,
            revenu6months,
            heatmapResponse,
            weekly,
            ] = await Promise.all([
            getStatsOverview(token),
            getSalesByDay(token),
            getTopProducts(token),
            getActiveHours(token),
            getTopCategories(token),
            getTopProductsByCategory(token),
            getRevenueByCategory(token),
            getRevenueByCategory(token, true),
            getRevenueLast6Months(token),
            getSalesHeatmap(token),
            getWeeklyHeatmap(token),
            ]);

            setOverview(ov);
            setSalesByDay(sales);
            setTopProducts(top);
            setActiveHours(hours);
            setTopCategories(categories);
            setTopProductsByCategory(topByCat);
            setRevenueByCategory(revenueCurrent);
            setPreviousRevenueByCategory(revenuePrevious);
            setRevenueLast6Months(revenu6months);
            setHeatmap(heatmapResponse.data);
            setHeatmapPeriod(heatmapResponse.period);
            setWeeklyHeatmap(weekly.data);
            setWeekStart(weekly.weekStart);
            setWeekEnd(weekly.weekEnd);
        } catch (err) {
            console.error("Erreur lors du chargement des statistiques :", err);
            setError("Impossible de charger les statistiques.");
        }
        };

        fetchStats();
    }, [token]);

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!overview) {
        return (
        <div className="text-center py-8">Chargement des statistiques...</div>
        );
    }

    const isCurrentMonthEmpty = revenueByCategory.length === 0;

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-black">
                Statistiques du Restaurant
            </h1>

            <Tabs defaultValue="overview" className="w-full">
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md pb-2">
            <TabsList className="w-full grid grid-cols-4 p-1 rounded-none bg-background">
                    <TabsTrigger
                    value="overview"
                    className="
                    flex items-center gap-2 text-sm font-medium
                    text-slate-600
                    rounded-lg
                    transition-all duration-300
                    hover:bg-emerald-50 hover:text-emerald-700
                    data-[state=active]:bg-emerald-600
                    data-[state=active]:text-white"
                    >
                    <Home size={16} />
                    Vue d’ensemble
                    </TabsTrigger>

                    <TabsTrigger
                    value="sales"
                    className="
                    flex items-center gap-2 text-sm font-medium
                    text-slate-600
                    rounded-lg
                    transition-all duration-300
                    hover:bg-emerald-50 hover:text-emerald-700
                    data-[state=active]:bg-emerald-600
                    data-[state=active]:text-white"
                    >
                    <TrendingUp size={16} />
                    Ventes
                    </TabsTrigger>

                    <TabsTrigger
                    value="products"
                    className="
                    flex items-center gap-2 text-sm font-medium
                    text-slate-600
                    rounded-lg
                    transition-all duration-300
                    hover:bg-emerald-50 hover:text-emerald-700
                    data-[state=active]:bg-emerald-600
                    data-[state=active]:text-white"
                    >
                    <Package size={16} />
                    Produits
                    </TabsTrigger>

                    <TabsTrigger
                    value="finance"
                    className="
                    flex items-center gap-2 text-sm font-medium
                    text-slate-600
                    rounded-lg
                    transition-all duration-300
                    hover:bg-emerald-50 hover:text-emerald-700
                    data-[state=active]:bg-emerald-600
                    data-[state=active]:text-white"
                    >
                    <PieChart size={16} />
                    Finances
                    </TabsTrigger>
                </TabsList>
            </div>
                

                {/* Vue d’ensemble */}
                <TabsContent className="animate-fadeIn" value="overview">
                    <StatsOverview data={overview} />

                    <div className="mt-8">
                        <RevenueLast6MonthsChart data={revenueLast6Months} />
                    </div>

                    <div className="mt-8">
                        <MonthlyForecastCard currentRevenue={overview.totalRevenue} />
                    </div>
                    
                </TabsContent>

                {/* Ventes */}
                <TabsContent className="animate-fadeIn" value="sales">
                    <SalesChart data={salesByDay} />
                    <div className="mt-8">
                        <ActiveHoursChart data={activeHours} />
                    </div>
                    
                    <div className="mt-8">
                        <SalesHeatmap period={heatmapPeriod} data={heatmap} />
                    </div>
                    
                    <div className="mt-8">
                        <WeeklyHeatmap
                        weekStart={weekStart}
                        weekEnd={weekEnd}
                        data={weeklyHeatmap}
                        />   
                    </div>
                    
                </TabsContent>

                {/* Produits */}
                <TabsContent className="animate-fadeIn" value="products">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopProducts data={topProducts} />
                    <TopCategories data={topCategories} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <TopProductsByCategory data={topProductsByCategory} />
                    </div>
                </TabsContent>

                {/* Finances */}
                <TabsContent className="animate-fadeIn animate-slideIn" value="finance">
                    <div className="w-full lg:w-2/3 mx-auto">
                    <RevenueByCategoryDonut
                        data={
                        isCurrentMonthEmpty
                            ? previousRevenueByCategory
                            : revenueByCategory
                        }
                        previousData={previousRevenueByCategory}
                        isPreviousFallback={isCurrentMonthEmpty}
                    />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
