// src/components/Shared/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/order-history">Order History</Link></li>
            <li><Link to="/admin">Admin</Link></li>
        </ul>
    </nav>
);

export default Header;
