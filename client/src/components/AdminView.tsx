// src/components/AdminView.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../apiClient';
import { PaperDTO, PropertyDTO, OrderDTO, UpdateOrderStatusDTO } from '../../Api';

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

    // New state for managing order status updates
    const [statusUpdates, setStatusUpdates] = useState<{ [orderId: number]: string }>({});
    const [updateMessages, setUpdateMessages] = useState<{ [orderId: number]: string }>({});
    const [loadingStatus, setLoadingStatus] = useState<{ [orderId: number]: boolean }>({});

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            const response = await apiClient.getAllProducts();
            setProducts(response.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching products:', error.message);
            } else {
                console.error('An unexpected error occurred while fetching products.');
            }
        }
    }, []);

    // Fetch all orders
    const fetchOrders = useCallback(async () => {
        try {
            const response = await apiClient.getAllOrders();
            setOrders(response.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching orders:', error.message);
            } else {
                console.error('An unexpected error occurred while fetching orders.');
            }
        }
    }, []);

    // Fetch all properties
    const fetchProperties = useCallback(async () => {
        try {
            const response = await apiClient.getAllProperties();
            setProperties(response.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching properties:', error.message);
            } else {
                console.error('An unexpected error occurred while fetching properties.');
            }
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error creating product:', error.message);
            } else {
                console.error('An unexpected error occurred while creating the product.');
            }
        }
    };

    // Discontinue a product
    const discontinueProduct = async (id: number) => {
        try {
            await apiClient.discontinueProduct(id);
            alert('Product discontinued successfully!');
            await fetchProducts();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error discontinuing product:', error.message);
            } else {
                console.error('An unexpected error occurred while discontinuing the product.');
            }
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error restocking product:', error.message);
            } else {
                console.error('An unexpected error occurred while restocking the product.');
            }
        }
    };

    // Create a new property
    const createProperty = async () => {
        if (!newProperty.trim()) {
            alert('Property name cannot be empty.');
            return;
        }

        try {
            const propertyData: PropertyDTO = {propertyName: newProperty.trim()};
            await apiClient.createProperty(propertyData);
            alert('Property created successfully!');
            setNewProperty('');
            await fetchProperties();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error creating property:', error.message);
            } else {
                console.error('An unexpected error occurred while creating the property.');
            }
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
            setAssignProperty({productId: 0, propertyId: 0});
            await fetchProducts();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error assigning property to product:', error.message);
            } else {
                console.error('An unexpected error occurred while assigning the property to the product.');
            }
        }
    };

    // Handle status change input
    const handleStatusChange = (orderId: number, newStatus: string) => {
        setStatusUpdates((prev) => ({
            ...prev,
            [orderId]: newStatus,
        }));
    };

    // Handle status update submission
    const handleUpdateStatus = async (orderId: number) => {
        const newStatus = statusUpdates[orderId];
        if (!newStatus || newStatus.trim() === '') {
            setUpdateMessages((prev) => ({
                ...prev,
                [orderId]: 'Status cannot be empty.',
            }));
            return;
        }

        const updateStatusDto: UpdateOrderStatusDTO = {
            status: newStatus.trim(),
        };

        setLoadingStatus((prev) => ({...prev, [orderId]: true}));

        try {
            await apiClient.updateOrderStatus(orderId, updateStatusDto);
            setUpdateMessages((prev) => ({
                ...prev,
                [orderId]: 'Status updated successfully.',
            }));
            await fetchOrders();
        } catch (error: unknown) {
            console.error(`Error updating status for order ${orderId}:`, error);
            let message = 'Failed to update status.';
            if (error instanceof Error) {
                message = error.message;
            }
            setUpdateMessages((prev) => ({
                ...prev,
                [orderId]: message,
            }));
        } finally {
            setLoadingStatus((prev) => ({...prev, [orderId]: false}));
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
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
            <input
                type="number"
                placeholder="Price"
                value={newProduct.price !== undefined ? newProduct.price : ''}
                onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
            />
            <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock !== undefined ? newProduct.stock : ''}
                onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value, 10)})}
            />
            <button onClick={createProduct}>Create Product</button>

            <h3>Product List</h3>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <strong>{product.name}</strong> - ${product.price?.toFixed(2)} - Stock: {product.stock} -
                        Discontinued:{' '}
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
                onChange={(e) => setAssignProperty({...assignProperty, productId: parseInt(e.target.value, 10)})}
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
                onChange={(e) => setAssignProperty({...assignProperty, propertyId: parseInt(e.target.value, 10)})}
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
                {orders
                    .filter((order): order is OrderDTO & { id: number } => order.id !== undefined)
                    .map((order) => (
                        <li key={order.id}>
                            <strong>Order #{order.id}</strong>
                            - Customer ID: {order.customerId}
                            - Status: {order.status}
                            - Total: $ {order.totalAmount?.toFixed(2)}
                            - Date: {new Date(order.orderDate).toLocaleString()}
                            <ul>
                                {order.orderEntries?.map((entry) => (
                                    <li key={entry.id}>
                                        Product ID: {entry.productId}, Quantity: {entry.quantity}
                                    </li>
                                ))}
                            </ul>
                            {/* Update Status Section */}
                            <div style={{marginTop: '10px'}}>
                                <label htmlFor={`status-select-${order.id}`}>Update Status:</label>
                                <select
                                    id={`status-select-${order.id}`}
                                    value={statusUpdates[order.id] || ''}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                    {/* Add other statuses as needed */}
                                </select>
                                <button onClick={() => handleUpdateStatus(order.id)} disabled={loadingStatus[order.id]}>
                                    {loadingStatus[order.id] ? 'Updating...' : 'Update'}
                                </button>
                                {/* Display feedback message */}
                                {updateMessages[order.id] && (
                                    <span
                                        style={{
                                            marginLeft: '10px',
                                            color: updateMessages[order.id].includes('successfully') ? 'green' : 'red',
                                        }}
                                    >
                                        {updateMessages[order.id]}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
    export default AdminView;
