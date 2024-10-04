import {Order} from "./Order.ts";

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    orders: Order[];
}