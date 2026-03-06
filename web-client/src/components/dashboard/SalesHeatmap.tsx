import { HeatmapPoint } from "@/types/HeatmapPoint";

interface Props {
    period: string; // ex: "2026-02"
    data: HeatmapPoint[];
}

export default function SalesHeatmap({ period, data }: Props) {
    if (!data || data.length === 0) {
        return (
        <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Heatmap des ventes</h2>
            <p className="text-sm text-muted-foreground">
            Pas assez de données pour afficher la heatmap.
            </p>
        </div>
        );
    }

    const [year, month] = period.split("-");
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

    const matrix = Array.from({ length: daysInMonth }, () => Array(24).fill(0));

    data.forEach((p) => {
        if (p.day >= 1 && p.day <= daysInMonth) {
        matrix[p.day - 1][p.hour] = p.total;
        }
    });

    const maxValue = Math.max(...data.map((d) => d.total), 1);

    return (
        <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-1">Heatmap des ventes</h2>
        <p className="text-sm text-muted-foreground mb-4">
            Période analysée : {period}
        </p>

        <div className="overflow-x-auto">
            <table className="border-collapse">
            <thead>
                <tr>
                <th className="p-2 text-sm"></th>
                {Array.from({ length: 24 }, (_, i) => (
                    <th key={i} className="p-1 text-xs text-muted-foreground">
                    {i}h
                    </th>
                ))}
                </tr>
            </thead>

            <tbody>
                {matrix.map((row, dayIndex) => (
                <tr key={dayIndex}>
                    <td className="p-1 text-sm font-medium text-muted-foreground">
                    {dayIndex + 1}
                    </td>

                    {row.map((value, hourIndex) => {
                    const intensity = value / maxValue;
                    const bg = `rgba(59, 130, 246, ${intensity})`;

                    return (
                        <td
                        key={hourIndex}
                        className="w-8 h-8 text-center text-xs border border-gray-200"
                        style={{ backgroundColor: bg }}
                        title={`${value} €`}
                        >
                        {value > 0 ? Math.round(value) : ""}
                        </td>
                    );
                    })}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
