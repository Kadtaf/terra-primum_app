export interface OrderUser {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface Order {
    id: string;
    userId: string;

    // Ajout pour l'admin
    user?: OrderUser;

    totalPrice: number;

    status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled";

    deliveryType: "delivery" | "pickup";

    createdAt: string;

    items: Array<{
        id: string;
        productId: string;
        quantity: number;
        price: number;
    }>;
}