import { TrendingUp, ShoppingBag, Users, Euro } from "lucide-react";

interface StatsData {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    averageOrderValue: number;
}

export default function StatsOverview({ data }: { data: StatsData }) {
    if (!data) {
        return (
        <div className="text-gray-500 text-sm">
            Chargement des statistiques…
        </div>
        );
    }

    const formatCurrency = (value: number) =>
        value.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

    const cards = [
        {
        label: "Chiffre d'affaires",
        value: formatCurrency(data.totalRevenue),
        icon: Euro,
        color: "text-green-600",
        },
        {
        label: "Commandes",
        value: data.totalOrders,
        icon: ShoppingBag,
        color: "text-blue-600",
        },
        {
        label: "Clients",
        value: data.totalUsers,
        icon: Users,
        color: "text-purple-600",
        },
        {
        label: "Panier moyen",
        value: formatCurrency(data.averageOrderValue),
        icon: TrendingUp,
        color: "text-orange-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
            <div
            key={i}
            className="bg-white p-6 rounded-lg shadow flex justify-between items-center hover:shadow-lg hover:scale-[1.02] transition"
            >
            <div>
                <p className="text-gray-600 text-sm">{c.label}</p>
                <p className="text-3xl font-bold">{c.value}</p>
            </div>
            <c.icon className={`w-10 h-10 ${c.color}`} />
            </div>
        ))}
        </div>
    );
}