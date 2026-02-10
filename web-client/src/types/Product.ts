export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}