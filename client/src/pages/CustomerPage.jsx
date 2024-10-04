// src/pages/CustomerPage.jsx
import React, { useState } from 'react';
import ProductOverview from '../components/Customer/ProductOverview';
import PlaceOrder from '../components/Customer/PlaceOrder';
import OrderHistory from '../components/Customer/OrderHistory';

const CustomerPage = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleAddToOrder = (product) => {
        const existing = selectedProducts.find(p => p.id === product.id);
        if (existing) {
            setSelectedProducts(selectedProducts.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
        } else {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div>
            <ProductOverview onAddToOrder={handleAddToOrder} />
            <PlaceOrder selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
            <OrderHistory />
        </div>
    );
};

export default CustomerPage;
