import {Api, Customer} from "../../Api.ts";
import {useEffect, useState} from "react";
const TestEnv = () => {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const MyApi = new Api({ baseURL: "http://localhost:5062" });

    async function sendMyRequest() {
        try {
            const response = await MyApi.api.customerList();
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


export default TestEnv;