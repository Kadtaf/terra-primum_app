export interface WeeklyHeatmapPoint {
    day: number; // 0–6
    hour: number; // 0–23
    total: number;
}

export interface WeeklyHeatmapResponse {
    weekStart: string;
    weekEnd: string;
    data: WeeklyHeatmapPoint[];
}
