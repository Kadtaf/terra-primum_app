import { WeeklyHeatmapPoint } from "@/types/WeeklyHeatmapPoint";

interface Props {
    weekStart: string;
    weekEnd: string;
    data: WeeklyHeatmapPoint[];
}

const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function WeeklyHeatmap({ weekStart, weekEnd, data }: Props) {
    if (!data || data.length === 0) {
        return (
        <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Heatmap hebdomadaire</h2>
            <p className="text-sm text-muted-foreground">
            Pas assez de données pour cette semaine.
            </p>
        </div>
        );
    }

    const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));

    data.forEach((p) => {
        matrix[p.day][p.hour] = p.total;
    });

    const maxValue = Math.max(...data.map((d) => d.total), 1);

    return (
        <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-1">Heatmap hebdomadaire</h2>
        <p className="text-sm text-muted-foreground mb-4">
            Semaine du {weekStart} au {weekEnd}
        </p>

        <div className="overflow-x-auto">
            <table className="border-collapse">
            <thead>
                <tr>
                <th className="p-2"></th>
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
                    {days[dayIndex]}
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
