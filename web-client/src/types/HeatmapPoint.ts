export interface HeatmapPoint {
    day: number; // 0 = dimanche
    hour: number; // 0–23
    total: number;
}

export interface HeatmapResponse {
    period: string;
    data: HeatmapPoint[];
}
