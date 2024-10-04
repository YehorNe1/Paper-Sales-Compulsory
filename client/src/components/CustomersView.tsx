import {Customer} from "../../Api.ts";
import {useEffect, useState} from "react";
import {apiClient} from "../apiClient.ts";
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
        <>
            <div>
                <h1>Customer List</h1>
                <ul>
                    {customers.map((customer) => (
                        <li key={customer.id}>{customer.name} - {customer.phone} - {customer.email}</li>
                    ))}
                </ul>
            </div>

            <button onClick={fetchCustomers}>Send</button>
        </>
    )
}


export default CustomersView;