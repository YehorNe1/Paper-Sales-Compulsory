export interface OrderPlacement {
    customerId: number;
    orderDate: string; // ISO string
    deliveryDate?: string | null; // ISO string
    status: string;
    orderEntries: OrderEntry[];
}

export interface OrderEntry {
    productId: number;
    quantity: number;
}