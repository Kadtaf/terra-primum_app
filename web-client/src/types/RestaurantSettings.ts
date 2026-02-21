import { OpeningHours } from './openihngHours';
export interface RestaurantSettings {
    id: string;
    openingHours: OpeningHours;
    deliveryFee: number;
    minOrderAmount: number;
    createdAt?: string;
    updatedAt?: string;
}