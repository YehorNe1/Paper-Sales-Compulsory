// src/pages/AdminPage.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';

const AdminPage = () => (
    <AdminDashboard>
        <Outlet />
    </AdminDashboard>
);

export default AdminPage;
