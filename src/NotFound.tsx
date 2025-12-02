import { NavLink } from "react-router-dom";
import "./NotFound.css"; 

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-box">
                <div className="not-found-icon">
                    🛑 {/* Emotikona Stop */}
                </div>
                <h1>404 - Nie znaleziono strony</h1>
                <p>
                    Przepraszamy, strona, której szukasz, nie istnieje.
                </p>
                <NavLink to="/cars" className="btn-home">
                    Wróć do listy aut
                </NavLink>
            </div>
        </div>
    )
}