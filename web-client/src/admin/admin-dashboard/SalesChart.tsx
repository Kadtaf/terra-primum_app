import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TooltipItem,
    ChartOptions,
} from "chart.js";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);
// Type pour les données de ventes
interface SalesData {
    date: string;
    total: number;
}
// Composant pour afficher un graphique des ventes par jour
export default function SalesChart({ data }: { data: SalesData[] }) {
    if (!data || data.length === 0) {
        return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Ventes par jour</h2>
            <p className="text-gray-500">Aucune donnée disponible.</p>
        </div>
        );
    }

    const chartData = {
        labels: data.map((d) => d.date),
        datasets: [
        {
            label: "Ventes (€)",
            data: data.map((d) => d.total),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.3)",
            tension: 0.3,
            fill: true,
        },
        ],
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
        legend: { display: true },
        tooltip: {
            callbacks: {
            label: (ctx: TooltipItem<"line">) => ` ${ctx.raw} €`,
            },
        },
        },
        scales: {
        y: {
            ticks: { callback: (value: string | number) => `${value} €` },
            grid: { color: "rgba(0,0,0,0.05)" },
        },
        x: {
            grid: { display: false },
        },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Ventes par jour</h2>
        <Line data={chartData} options={options} />
        </div>
    );
}