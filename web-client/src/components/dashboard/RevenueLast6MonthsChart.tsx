import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface RevenueLastMonths {
    month: string;
    totalRevenue: number;
}

interface Props {
data: RevenueLastMonths[];
}

const formatCurrency = (value: number) =>
value.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

const formatMonth = (month: string) => {
const [m, year] = month.split("-");

return new Date(Number(year), Number(m) - 1).toLocaleString("fr-FR", {
    month: "short",
});
};

export default function RevenueLast6MonthsChart({ data }: Props) {
        if (!data || data.length === 0) {
        return (
            <div className="bg-card p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Évolution du CA (6 mois)</h2>
                <p className="text-sm text-muted-foreground">
                    Pas encore assez de données pour afficher la tendance.
                </p>
            </div>
        );
        }
    
        const chartData = data.map((item) => ({
        name: formatMonth(item.month),
        value: item.totalRevenue,
        }));
    
        return (
        <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Évolution du CA (6 derniers mois)</h2>
    
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
            
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            animationDuration={600}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}