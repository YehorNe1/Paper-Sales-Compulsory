// src/components/Customer/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import { fetchCustomerOrders } from '../../api/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const customerId = '123'; // Replace with actual customer ID

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await fetchCustomerOrders(customerId);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    return (
        <div>
            <h2>Your Order History</h2>
            {orders.length === 0 ? <p>No orders found.</p> : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <strong>Order ID:</strong> {order.id} | <strong>Status:</strong> {order.status}
                            <ul>
                                {order.entries.map(entry => (
                                    <li key={entry.productId}>{entry.productName} - Quantity: {entry.quantity}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
