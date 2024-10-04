import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Shared/Header';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';
import ManageProducts from './components/Admin/ManageProducts';
import ManageOrders from './components/Admin/ManageOrders';

const App = () => (
    <Router>
        <Header />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<CustomerPage />} />
            <Route path="/order-history" element={<CustomerPage />} />
            <Route path="/admin" element={<AdminPage />}>
                <Route path="manage-products" element={<ManageProducts />} />
                <Route path="manage-orders" element={<ManageOrders />} />
            </Route>
        </Routes>
    </Router>
);

export default App;
