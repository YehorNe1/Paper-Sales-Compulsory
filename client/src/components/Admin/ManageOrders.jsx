// src/components/Admin/ManageOrders.jsx
import React, { useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../api/api';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await fetchAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            loadOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div>
            <h3>Manage Orders</h3>
            {orders.length === 0 ? <p>No orders found.</p> : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <strong>Order ID:</strong> {order.id} | <strong>Customer ID:</strong> {order.customerId} | <strong>Status:</strong> {order.status}
                            <ul>
                                {order.entries.map(entry => (
                                    <li key={entry.productId}>{entry.productName} - Quantity: {entry.quantity}</li>
                                ))}
                            </ul>
                            <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageOrders;
