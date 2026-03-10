export interface User {
    id: string;
    email: string;
    role: "user" | "admin";
    phone?: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
    loyaltyPoints: number;
}