// src/components/CustomersView.tsx
import '../App.css';
import { Customer } from '../../Api.ts';
import { apiClient } from '../apiClient.ts';
import {useEffect, useState} from "react";

const CustomersView = () => {

    const [customers, setCustomers] = useState<Customer[]>([]);

    async function sendMyRequest() {
        try {
            const response = await apiClient.api.customerList();
            setCustomers(response.data); // set the customers state with fetched data
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    }

    const fetchCustomers = () => {
        sendMyRequest();
    };

    // Optional: Automatically fetch customers on component mount
    useEffect(() => {
        // fetchCustomers();
    }, []);

    return (
        <div className="page-container">
            <h1>Customers Page</h1>
            <h2>Customer List</h2>
            <ul>
                {customers.map((customer) => (
                    <li key={customer.id}>
                        {customer.name} - {customer.phone} - {customer.email}
                    </li>
                ))}
            </ul>
            <button onClick={fetchCustomers}>Send</button>
        </div>
    );
};

export default CustomersView;
