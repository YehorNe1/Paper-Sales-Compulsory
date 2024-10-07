// src/components/CustomersView.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../apiClient';
import { PaperDTO, OrderDTO, OrderEntryDTO } from '../../Api';

const CustomersView: React.FC = () => {
    const [products, setProducts] = useState<PaperDTO[]>([]);
    const [search, setSearch] = useState('');
    const [orderEntries, setOrderEntries] = useState<OrderEntryDTO[]>([]);
    const customerId = 1; // Replace with actual customer ID or authentication logic
    const [orders, setOrders] = useState<OrderDTO[]>([]);

    // Fetch products with optional search
    const fetchProducts = useCallback(async () => {
        try {
            const response = await apiClient.getProducts(search);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [search]);

    // Fetch customer's order history
    const fetchOrders = useCallback(async () => {
        try {
            const response = await apiClient.getOrdersByCustomerId(customerId);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [customerId]);

    // Handle adding a product to the order
    const addToOrder = (productId: number) => {
        setOrderEntries((prevEntries) => {
            const existingEntry = prevEntries.find((entry) => entry.productId === productId);
            if (existingEntry) {
                // Increment quantity
                return prevEntries.map((entry) =>
                    entry.productId === productId ? { ...entry, quantity: entry.quantity + 1 } : entry
                );
            } else {
                // Add new entry
                return [...prevEntries, { productId, quantity: 1 }];
            }
        });
    };

    // Place the order
    const placeOrder = async () => {
        if (orderEntries.length === 0) {
            alert('No products in the order.');
            return;
        }

        try {
            const orderData: OrderDTO = {
                customerId,
                orderDate: new Date().toISOString(),
                status: 'Pending',
                orderEntries: orderEntries.map((entry) => ({
                    productId: entry.productId,
                    quantity: entry.quantity,
                })),
            };
            await apiClient.placeOrder(orderData);
            alert('Order placed successfully!');
            setOrderEntries([]);
            await fetchOrders();
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts();
            await fetchOrders();
        };
        fetchData().catch((error) => {
            console.error('Error in fetchData:', error);
        });
    }, [fetchProducts, fetchOrders]);

    return (
        <div className="page-container">
            <h1>Customer Page</h1>

            {/* Product Overview with Search */}
            <h2>Product Overview</h2>
            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={fetchProducts}>Search</button>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - ${product.price?.toFixed(2)} - Stock: {product.stock}
                        <button onClick={() => addToOrder(product.id!)}>Add to Order</button>
                    </li>
                ))}
            </ul>

            {/* Order Entries */}
            <h2>Your Order</h2>
            {orderEntries.length > 0 ? (
                <div>
                    <ul>
                        {orderEntries.map((entry) => {
                            const product = products.find((p) => p.id === entry.productId);
                            return (
                                <li key={entry.productId}>
                                    {product?.name} - Quantity: {entry.quantity}
                                </li>
                            );
                        })}
                    </ul>
                    <button onClick={placeOrder}>Place Order</button>
                </div>
            ) : (
                <p>No products in your order.</p>
            )}

            {/* Order History */}
            <h2>Your Order History</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <strong>Order #{order.id}</strong> - Total: ${order.totalAmount?.toFixed(2)} - Date:{' '}
                        {new Date(order.orderDate).toLocaleString()}
                        <ul>
                            {order.orderEntries?.map((entry) => (
                                <li key={entry.id}>
                                    Product ID: {entry.productId}, Quantity: {entry.quantity}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomersView;
