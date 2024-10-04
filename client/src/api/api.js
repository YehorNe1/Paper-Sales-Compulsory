//all communication with the server
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5062/api';

// Products

export const fetchProducts = (params) => axios.get(`${API_BASE_URL}/products`, { params });
export const createProduct = (product) => axios.post(`${API_BASE_URL}/products`, product);
export const updateProduct = (id, product) => axios.put(`${API_BASE_URL}/products/${id}`, product);
export const discontinueProduct = (id) => axios.patch(`${API_BASE_URL}/products/${id}/discontinue`);
export const restockProduct = (id) => axios.patch(`${API_BASE_URL}/products/${id}/restock`);

// Orders

export const placeOrder = (order) => axios.post(`${API_BASE_URL}/orders`, order);
export const fetchCustomerOrders = (customerId) => axios.get(`${API_BASE_URL}/orders/customer/${customerId}`);
export const fetchAllOrders = () => axios.get(`${API_BASE_URL}/orders/all`);
export const updateOrderStatus = (orderId, status) => axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, status);

// Custom Properties

export const fetchCustomProperties = () => axios.get(`${API_BASE_URL}/products/custom-properties`);
export const addCustomProperty = (property) => axios.post(`${API_BASE_URL}/products/custom-properties`, property);
export const updateCustomProperty = (propertyId, property) => axios.put(`${API_BASE_URL}/products/custom-properties/${propertyId}`, property);
export const deleteCustomProperty = (propertyId) => axios.delete(`${API_BASE_URL}/products/custom-properties/${propertyId}`);
