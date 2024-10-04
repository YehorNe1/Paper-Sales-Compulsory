// src/components/Shared/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product, onAddToOrder }) => (
    <div className="product-card">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <button onClick={() => onAddToOrder(product)}>Add to Order</button>
    </div>
);

export default ProductCard;
