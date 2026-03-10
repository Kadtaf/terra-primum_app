export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string | null;
    category: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    ingredients: string[];
    allergens: string[];

}