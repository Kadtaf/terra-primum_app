
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueByCategoryItem {
    categoryId: string;
    categoryName: string;
    totalRevenue: number;
}

interface RevenueByCategoryDonutProps {
    data: RevenueByCategoryItem[];
    previousData?: RevenueByCategoryItem[]; 
    isPreviousFallback?:boolean;
}

const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f97316",
    "#a855f7",
    "#eab308",
    "#ec4899",
    "#06b6d4",
    "#818A76",
];

const formatCurrency = (value: number) =>
    value.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

type ChartDatum = {
    name: string;
    value: number;
    percent: number;
};

export default function RevenueByCategoryDonut({
    data,
    previousData = [],
    isPreviousFallback = false, 
    }: RevenueByCategoryDonutProps) {

    if ((!data || data.length === 0) && (!previousData || previousData.length === 0)) {
        return (
        <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">
            Répartition du chiffre d’affaires par catégorie
            </h2>
            <p className="text-sm text-muted-foreground">
            Pas encore de données disponibles.
            </p>
        </div>
        );
    }

    // 1️. Construire les données du donut
    const baseData = data.map((item) => ({
        name: item.categoryName,
        value: item.totalRevenue,
    }));

    // 2️. Total
    const total = baseData.reduce((sum, item) => sum + item.value, 0);

    // 3️. Ajouter les pourcentages
    const chartData: ChartDatum[] = baseData.map((item) => ({
        ...item,
        percent: total > 0 ? (item.value / total) * 100 : 0,
    }));

    // 4️. Labels sur le donut
    const renderLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const item = chartData[index];
        if (!item || item.percent < 3) return null;

        return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
        >
            {item.percent.toFixed(1)}%
        </text>
        );
    };

    // 5️. Comparatif mois N / mois N‑1
    const comparison = chartData.map((item) => {
        const prev = previousData.find((p) => p.categoryName === item.name);

        const previousValue = prev ? prev.totalRevenue : 0;
        const diff = item.value - previousValue;
        const diffPercent = previousValue > 0 ? (diff / previousValue) * 100 : 0;

        return {
        name: item.name,
        current: item.value,
        previous: previousValue,
        diff,
        diffPercent,
        };
    });

    return (
        <div className="bg-card p-6 rounded-lg shadow flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">
            Répartition du chiffre d’affaires par catégorie
        </h2>

        {isPreviousFallback && (
            <p className="text-xs text-muted-foregroundb mb-3">
                Affichage des données du mois précédent (Aucune vente ce mois-ci)
            </p>
        )}
        
        {/* Donut chart */}
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                key={chartData.map((d) => d.value).join("-")} 
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={2}
                label={renderLabel}
                labelLine={false}
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={900}
                animationEasing="ease-out"
                >
                {chartData.map((entry, index) => (
                    <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    />
                ))}
                </Pie>

                <Tooltip
                formatter={(value: unknown, _name, props: any) => {
                    const payload = props.payload as ChartDatum;
                    return [
                    `${formatCurrency(value as number)} (${payload.percent.toFixed(
                        1,
                    )} %)`,
                    "Chiffre d’affaires",
                    ];
                }}
                />
            </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Légende */}
        <div className="mt-6 w-full flex flex-col items-start">
            {chartData.map((entry, index) => (
            <div key={index} className="flex items-center mb-2 text-sm">
                <span
                className="inline-block w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium">
                {entry.name} — {entry.percent.toFixed(1)} % —{" "}
                {formatCurrency(entry.value)}
                </span>
            </div>
            ))}
        </div>

        {/* Comparatif mois précédent */}
        <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-3">
            Évolution par rapport au mois précédent
            </h3>

            {comparison.map((item, index) => (
            <div key={index} className="flex items-center mb-2 text-sm">
                <span
                className="inline-block w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />

                <span className="font-medium w-48">{item.name}</span>

                <span
                className={
                    item.diff >= 0
                    ? "text-green-500 font-semibold"
                    : "text-red-500 font-semibold"
                }
                >
                {item.diff >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(item.diffPercent).toFixed(1)} %
                </span>

                <span className="ml-4 text-muted-foreground">
                {formatCurrency(item.previous)} → {formatCurrency(item.current)}
                </span>
            </div>
            ))}
        </div>
        </div>
    );
}
