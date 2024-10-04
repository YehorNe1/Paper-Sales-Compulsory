// src/components/Customer/PlaceOrder.jsx
import React, { useState } from 'react';
import { placeOrder } from '../../api/api';

const PlaceOrder = ({ selectedProducts, setSelectedProducts }) => {
    const [order, setOrder] = useState({ entries: [], customerId: '123' }); // Replace '123' with actual customer ID

    const handleSubmit = async () => {
        try {
            await placeOrder({ ...order, entries: selectedProducts });
            alert('Order placed successfully!');
            setSelectedProducts([]);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    return (
        <div>
            <h2>Place Order</h2>
            <ul>
                {selectedProducts.map((prod, index) => (
                    <li key={index}>{prod.name} - Quantity: {prod.quantity}</li>
                ))}
            </ul>
            <button onClick={handleSubmit} disabled={selectedProducts.length === 0}>Submit Order</button>
        </div>
    );
};

export default PlaceOrder;
