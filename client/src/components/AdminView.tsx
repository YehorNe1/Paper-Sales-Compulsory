// src/components/AdminView.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../apiClient';
import { PaperDTO, PropertyDTO, OrderDTO } from '../../Api';

const AdminView: React.FC = () => {
    const [products, setProducts] = useState<PaperDTO[]>([]);
    const [newProduct, setNewProduct] = useState<Partial<PaperDTO>>({});
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [properties, setProperties] = useState<PropertyDTO[]>([]);
    const [newProperty, setNewProperty] = useState<string>('');
    const [assignProperty, setAssignProperty] = useState<{ productId: number; propertyId: number }>({
        productId: 0,
        propertyId: 0,
    });

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            const response = await apiClient.getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    // Fetch all orders
    const fetchOrders = useCallback(async () => {
        try {
            const response = await apiClient.getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, []);

    // Fetch all properties
    const fetchProperties = useCallback(async () => {
        try {
            const response = await apiClient.getAllProperties();
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    }, []);

    // Create a new product
    const createProduct = async () => {
        if (!newProduct.name || newProduct.price === undefined || newProduct.stock === undefined) {
            alert('Please fill in all product fields.');
            return;
        }

        try {
            const productData: PaperDTO = {
                name: newProduct.name,
                price: newProduct.price,
                stock: newProduct.stock,
                discontinued: false,
            };
            await apiClient.createProduct(productData);
            alert('Product created successfully!');
            setNewProduct({});
            await fetchProducts();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    // Discontinue a product
    const discontinueProduct = async (id: number) => {
        try {
            await apiClient.discontinueProduct(id);
            alert('Product discontinued successfully!');
            await fetchProducts();
        } catch (error) {
            console.error('Error discontinuing product:', error);
        }
    };

    // Restock a product
    const restockProduct = async (id: number) => {
        const quantityStr = prompt('Enter restock quantity:', '0');
        const quantity = parseInt(quantityStr || '0', 10);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        try {
            await apiClient.restockProduct(id, quantity);
            alert('Product restocked successfully!');
            await fetchProducts();
        } catch (error) {
            console.error('Error restocking product:', error);
        }
    };

    // Create a new property
    const createProperty = async () => {
        if (!newProperty.trim()) {
            alert('Property name cannot be empty.');
            return;
        }

        try {
            const propertyData: PropertyDTO = { propertyName: newProperty.trim() };
            await apiClient.createProperty(propertyData);
            alert('Property created successfully!');
            setNewProperty('');
            await fetchProperties();
        } catch (error) {
            console.error('Error creating property:', error);
        }
    };

    // Assign property to product
    const assignPropertyToProductHandler = async () => {
        if (assignProperty.productId === 0 || assignProperty.propertyId === 0) {
            alert('Please select both a product and a property.');
            return;
        }

        try {
            await apiClient.assignPropertyToProduct(assignProperty.propertyId, assignProperty.productId);
            alert('Property assigned to product successfully!');
            setAssignProperty({ productId: 0, propertyId: 0 });
            await fetchProducts();
        } catch (error) {
            console.error('Error assigning property to product:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts();
            await fetchOrders();
            await fetchProperties();
        };
        fetchData().catch((error) => {
            console.error('Error in fetchData:', error);
        });
    }, [fetchProducts, fetchOrders, fetchProperties]);

    return (
        <div className="page-container">
            <h1>Admin Page</h1>

            {/* Manage Products */}
            <h2>Manage Products</h2>
            <h3>Create New Product</h3>
            <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name || ''}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
                type="number"
                placeholder="Price"
                value={newProduct.price !== undefined ? newProduct.price : ''}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            />
            <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock !== undefined ? newProduct.stock : ''}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })}
            />
            <button onClick={createProduct}>Create Product</button>

            <h3>Product List</h3>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <strong>{product.name}</strong> - ${product.price?.toFixed(2)} - Stock: {product.stock} - Discontinued:{' '}
                        {product.discontinued ? 'Yes' : 'No'}
                        {!product.discontinued && (
                            <button onClick={() => discontinueProduct(product.id!)}>Discontinue</button>
                        )}
                        <button onClick={() => restockProduct(product.id!)}>Restock</button>
                    </li>
                ))}
            </ul>

            {/* Manage Properties */}
            <h2>Manage Properties</h2>
            <h3>Create New Property</h3>
            <input
                type="text"
                placeholder="Property Name"
                value={newProperty}
                onChange={(e) => setNewProperty(e.target.value)}
            />
            <button onClick={createProperty}>Create Property</button>

            <h3>Assign Property to Product</h3>
            <select
                value={assignProperty.productId}
                onChange={(e) => setAssignProperty({ ...assignProperty, productId: parseInt(e.target.value, 10) })}
            >
                <option value={0}>Select Product</option>
                {products.map((product) => (
                    <option key={product.id} value={product.id}>
                        {product.name}
                    </option>
                ))}
            </select>
            <select
                value={assignProperty.propertyId}
                onChange={(e) => setAssignProperty({ ...assignProperty, propertyId: parseInt(e.target.value, 10) })}
            >
                <option value={0}>Select Property</option>
                {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                        {property.propertyName}
                    </option>
                ))}
            </select>
            <button onClick={assignPropertyToProductHandler}>Assign Property</button>

            {/* View All Orders */}
            <h2>All Customer Orders</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <strong>Order #{order.id}</strong> - Customer ID: {order.customerId} - Total: $
                        {order.totalAmount?.toFixed(2)} - Date: {new Date(order.orderDate).toLocaleString()}
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

export default AdminView;
