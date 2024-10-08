// src/components/CustomersView.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../apiClient';
import { PaperDTO, OrderDTO, OrderEntryDTO, PropertyDTO } from '../../Api';

const CustomersView: React.FC = () => {
    const [products, setProducts] = useState<PaperDTO[]>([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<string>(''); // State for sorting
    const [ascending, setAscending] = useState<boolean>(true); // State for sort direction
    const [propertyId, setPropertyId] = useState<number | undefined>(undefined); // State for filtering
    const [properties, setProperties] = useState<PropertyDTO[]>([]); // State for available properties
    const [orderEntries, setOrderEntries] = useState<OrderEntryDTO[]>([]);
    const customerId = 2; // Replace with actual customer ID or authentication logic
    const [orders, setOrders] = useState<OrderDTO[]>([]);

    // Fetch available properties for filtering
    const fetchProperties = useCallback(async () => {
        try {
            const response = await apiClient.getAllProperties();
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    }, []);

    // Fetch products with search, sort, and filter
    const fetchProducts = useCallback(async () => {
        try {
            const response = await apiClient.getProducts(search, sortBy, ascending, propertyId);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [search, sortBy, ascending, propertyId]);

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
            await fetchProducts(); // Refresh products in case stock changed
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProperties(); // Fetch properties first
            await fetchProducts();
            await fetchOrders();
        };
        fetchData().catch((error) => {
            console.error('Error in fetchData:', error);
        });
    }, [fetchProducts, fetchOrders, fetchProperties]);

    return (
        <div className="page-container">
            <h1>Customer Page</h1>

            {/* Product Overview with Search, Sort, and Filter */}
            <h2>Product Overview</h2>
            <div className="controls">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={fetchProducts}>Search</button>

                {/* Sort By Dropdown */}
                <label htmlFor="sortBy">Sort By:</label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">-- Select --</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                </select>

                {/* Sort Order Toggle */}
                <label htmlFor="ascending">Order:</label>
                <select
                    id="ascending"
                    value={ascending ? 'asc' : 'desc'}
                    onChange={(e) => setAscending(e.target.value === 'asc')}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>

                {/* Filter by Property Dropdown */}
                <label htmlFor="propertyFilter">Filter by Property:</label>
                <select
                    id="propertyFilter"
                    value={propertyId ?? ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        setPropertyId(value ? Number(value) : undefined);
                    }}
                >
                    <option value="">-- All Properties --</option>
                    {properties.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                            {prop.propertyName}
                        </option>
                    ))}
                </select>

                {/* Apply Filters Button */}
                <button onClick={fetchProducts}>Apply</button>
            </div>

            {/* Products List */}
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
                        <strong>Order #{order.id}</strong>
                        - Status: {order.status}
                        - Total: ${order.totalAmount?.toFixed(2)} - Date:{' '}
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
