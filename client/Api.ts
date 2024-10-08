// src/Api.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/** Define interfaces for your DTO classes */

/** CustomerDTO */
export interface CustomerDTO {
    id?: number;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
}

/** OrderDTO */
export interface OrderDTO {
    id?: number;
    orderDate: string;
    deliveryDate?: string;
    status: string;
    totalAmount?: number;
    customerId: number;
    orderEntries?: OrderEntryDTO[];
}

/** OrderEntryDTO */
export interface OrderEntryDTO {
    id?: number;
    quantity: number;
    productId: number;
    orderId?: number;
    product?: PaperDTO;
}

/** PaperDTO */
export interface PaperDTO {
    id?: number;
    name: string;
    discontinued?: boolean;
    stock?: number;
    price?: number;
    properties?: PropertyDTO[];
}

/** PropertyDTO */
export interface PropertyDTO {
    id?: number;
    propertyName: string;
}

/** UpdateOrderStatusDTO */
export interface UpdateOrderStatusDTO {
    status: string;
}

/** API class containing methods for each endpoint */
export class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        // Merge the provided config with default settings
        const axiosConfig: AxiosRequestConfig = {
            baseURL: 'http://localhost:5062/api', // Default base URL
            headers: {
                'Content-Type': 'application/json',
            },
            ...config,
        };

        /** Create an Axios instance with the merged configuration */
        this.axiosInstance = axios.create(axiosConfig);
    }

    /** PRODUCTS ENDPOINTS */

    /** Get products with optional search and filtering */
    public async getProducts(
        search?: string,
        sortBy?: string,
        ascending?: boolean,
        propertyId?: number,
    ): Promise<AxiosResponse<PaperDTO[]>> {
        const params: Record<string, string | number | boolean> = {};
        if (search) params.search = search;
        if (sortBy) params.sortBy = sortBy;
        if (ascending !== undefined) params.ascending = ascending;
        if (propertyId !== undefined) params.propertyId = propertyId;

        return this.axiosInstance.get<PaperDTO[]>('/Products', { params });
    }

    /** ADMIN PRODUCTS ENDPOINTS */

    /** Create a new product */
    public async createProduct(product: PaperDTO): Promise<AxiosResponse<PaperDTO>> {
        return this.axiosInstance.post<PaperDTO>('/admin/AdminProducts', product);
    }

    /** Discontinue a product */
    public async discontinueProduct(id: number): Promise<AxiosResponse<void>> {
        return this.axiosInstance.put<void>(`/admin/AdminProducts/${id}/Discontinue`);
    }

    /** Restock a product */
    public async restockProduct(id: number, quantity: number): Promise<AxiosResponse<void>> {
        return this.axiosInstance.put<void>(`/admin/AdminProducts/${id}/Restock`, quantity);
    }

    /** Get all products */
    public async getAllProducts(): Promise<AxiosResponse<PaperDTO[]>> {
        return this.axiosInstance.get<PaperDTO[]>('/Products');
    }

    /** ORDERS ENDPOINTS */

    /** Place an order */
    public async placeOrder(orderDto: OrderDTO): Promise<AxiosResponse<OrderDTO>> {
        return this.axiosInstance.post<OrderDTO>('/Orders', orderDto);
    }

    /** Get order by ID */
    public async getOrderById(id: number): Promise<AxiosResponse<OrderDTO>> {
        return this.axiosInstance.get<OrderDTO>(`/Orders/${id}`);
    }

    /** Get orders by customer ID */
    public async getOrdersByCustomerId(customerId: number): Promise<AxiosResponse<OrderDTO[]>> {
        return this.axiosInstance.get<OrderDTO[]>(`/Orders/Customer/${customerId}`);
    }

    /** ADMIN ORDERS ENDPOINTS */

    /** Get all orders */
    public async getAllOrders(): Promise<AxiosResponse<OrderDTO[]>> {
        return this.axiosInstance.get<OrderDTO[]>('/admin/AdminOrders');
    }

    public async updateOrderStatus(id: number, updateStatusDto: UpdateOrderStatusDTO): Promise<AxiosResponse<void>> {
        return this.axiosInstance.put<void>(`/admin/AdminOrders/${id}/status`, updateStatusDto);
    }

    /** PROPERTIES ENDPOINTS */

    /** Create a new property */
    public async createProperty(propertyDto: PropertyDTO): Promise<AxiosResponse<PropertyDTO>> {
        return this.axiosInstance.post<PropertyDTO>('/admin/Properties', propertyDto);
    }

    /** Get all properties */
    public async getAllProperties(): Promise<AxiosResponse<PropertyDTO[]>> {
        return this.axiosInstance.get<PropertyDTO[]>('/admin/Properties');
    }

    /** Assign a property to a product */
    public async assignPropertyToProduct(propertyId: number, productId: number): Promise<AxiosResponse<void>> {
        return this.axiosInstance.post<void>(`/admin/Properties/${propertyId}/AddToProduct/${productId}`);
    }
}