// src/App.tsx
import './index.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CustomersView from "./components/CustomersView.tsx";
import AdminView from "./components/AdminView.tsx";
import Home from "./components/Home.tsx";
import Navigation from "./components/Navigation.tsx";

function App() {
    return (
        <BrowserRouter>
            <Navigation /> {/* Always visible navigation bar */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/customers" element={<CustomersView />} />
                <Route path="/admin" element={<AdminView />} />
                {/* 404 Not Found Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

// Optional NotFound Component
const NotFound = () => (
    <div className="page-container">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
    </div>
);

export default App;
