// src/components/Admin/AdminDashboard.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => (
    <div>
        <h2>Admin Dashboard</h2>
        <nav>
            <ul>
                <li><Link to="manage-products">Manage Products</Link></li>
                <li><Link to="manage-orders">Manage Orders</Link></li>
            </ul>
        </nav>
        <Outlet />
    </div>
);

export default AdminDashboard;
