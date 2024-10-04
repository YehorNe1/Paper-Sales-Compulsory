// src/components/Admin/ManageProducts.jsx
import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, addCustomProperty } from '../../api/api';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0 });
    const [customProperty, setCustomProperty] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await fetchProducts({});
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleCreateProduct = async () => {
        try {
            await createProduct(newProduct);
            setNewProduct({ name: '', description: '', price: 0 });
            loadProducts();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleDiscontinue = async (id) => {
        try {
            await updateProduct(id, { discontinued: true });
            loadProducts();
        } catch (error) {
            console.error('Error discontinuing product:', error);
        }
    };

    const handleRestock = async (id, quantity) => {
        try {
            await updateProduct(id, { $inc: { stock: quantity } });
            loadProducts();
        } catch (error) {
            console.error('Error restocking product:', error);
        }
    };

    const handleAddCustomProperty = async () => {
        try {
            await addCustomProperty({ property: customProperty });
            setCustomProperty('');
            alert('Custom property added.');
        } catch (error) {
            console.error('Error adding custom property:', error);
        }
    };

    return (
        <div>
            <h3>Manage Products</h3>
            <div>
                <h4>Create New Product</h4>
                <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input type="text" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                <button onClick={handleCreateProduct}>Create Product</button>
            </div>
            <div>
                <h4>Add Custom Property</h4>
                <input type="text" placeholder="Property" value={customProperty} onChange={e => setCustomProperty(e.target.value)} />
                <button onClick={handleAddCustomProperty}>Add Property</button>
            </div>
            <div>
                <h4>Existing Products</h4>
                <ul>
                    {products.map(product => (
                        <li key={product.id}>
                            {product.name} - {product.discontinued ? 'Discontinued' : 'Active'}
                            <button onClick={() => handleDiscontinue(product.id)} disabled={product.discontinued}>Discontinue</button>
                            <button onClick={() => handleRestock(product.id, 10)}>Restock 10</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageProducts;
