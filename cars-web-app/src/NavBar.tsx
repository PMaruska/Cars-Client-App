import { NavLink } from "react-router-dom";
import logo from "./logo.svg";
import "./NavBar.css";

export default function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    🚗 Car Manager
                </NavLink>

                <div className="nav-link">
                    <NavLink
                        to="/cars"
                        className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                    >
                        Lista Aut
                    </NavLink>

                    <NavLink to="/edit/new">
                        <button className="btn-add">
                            Dodaj Auto
                        </button>
                    </NavLink>
                </div>
               
            </div>
        </nav>
    );
}

