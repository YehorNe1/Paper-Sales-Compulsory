// src/components/Customer/ProductOverview.jsx
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/api';
import ProductCard from '../Shared/ProductCard';

const ProductOverview = ({ onAddToOrder }) => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({ search: '', sort: 'name' });

    useEffect(() => {
        loadProducts();
    }, [filters]);

    const loadProducts = async () => {
        try {
            const response = await fetchProducts(filters);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearchChange = (e) => setFilters({ ...filters, search: e.target.value });
    const handleSortChange = (e) => setFilters({ ...filters, sort: e.target.value });

    return (
        <div>
            <h2>Product Overview</h2>
            <div>
                <input type="text" placeholder="Search..." value={filters.search} onChange={handleSearchChange} />
                <select value={filters.sort} onChange={handleSortChange}>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    {/* Add more sorting options as needed */}
                </select>
            </div>
            <div className="product-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToOrder={onAddToOrder} />
                ))}
            </div>
        </div>
    );
};

export default ProductOverview;
