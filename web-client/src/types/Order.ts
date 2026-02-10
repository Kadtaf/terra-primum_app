interface Order {
    id: string;
    userId: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    deliveryType: 'delivery' | 'pickup';
    createdAt: string;
    items: Array<{
        id: string;
        productId: string;
        quantity: number;
        price: number;
    }>;
}

export type { Order };