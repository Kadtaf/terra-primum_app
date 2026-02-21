import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    TooltipItem,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ActiveHour {
    hour: number;
    count: number;
}

export default function ActiveHoursChart({ data }: { data: ActiveHour[] }) {
    if (!data || data.length === 0) {
        return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Heures les plus actives</h2>
            <p className="text-gray-500">Aucune donnée disponible.</p>
        </div>
        );
    }

    const chartData = {
        labels: data.map((d) => `${d.hour}h`),
        datasets: [
        {
            label: "Commandes",
            data: data.map((d) => d.count),
            backgroundColor: "#10b981",
            borderRadius: 4,
        },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
            label: (ctx: TooltipItem<'bar'>) => ` ${ctx.raw} commandes`,
            },
        },
        },
        scales: {
        y: {
            ticks: { stepSize: 1 },
            grid: { color: "rgba(0,0,0,0.05)" },
        },
        x: {
            grid: { display: false },
        },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Heures les plus actives</h2>
        <Bar data={chartData} options={options} />
        </div>
    );
}