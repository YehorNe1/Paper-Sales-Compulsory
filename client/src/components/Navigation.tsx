import { NavLink } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo3.png';

const Navigation = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Dunder Mifflin Logo" />
                <span className="company-name">Dunder Mifflin</span>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "active" : undefined}
                        end
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/customers"
                        className={({ isActive }) => isActive ? "active" : undefined}
                    >
                        Customers
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => isActive ? "active" : undefined}
                    >
                        Admin Page
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
