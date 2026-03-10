import { useMemo } from "react";

interface MonthlyForecastCardProps {
  currentRevenue: number; // CA du mois actuel
}

export default function MonthlyForecastCard({
    currentRevenue,
    }: MonthlyForecastCardProps) {
    const today = new Date();
    const currentDay = today.getDate();
    const totalDays = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
    ).getDate();

    const forecast = useMemo(() => {
        if (currentDay === 0 || currentRevenue === 0) return 0;
        return (currentRevenue / currentDay) * totalDays;
    }, [currentRevenue, currentDay, totalDays]);

    const formatCurrency = (value: number) =>
        value.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

    return (
        <div className="bg-card p-6 rounded-lg shadow flex flex-col">
            <h2 className="text-xl font-bold mb-2">Prévision du CA mensuel</h2>

            <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(forecast)}
            </div>

            <p className="text-muted-foreground text-sm">
                Basé sur {currentDay} jours d’activité.
            </p>

            <p className="text-muted-foreground text-sm mt-1">
                CA actuel :{" "}
                <span className="font-semibold">{formatCurrency(currentRevenue)}</span>
            </p>
        </div>
    );
}
