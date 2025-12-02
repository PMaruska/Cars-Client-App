import { useEffect, useState } from "react";
import { Car, BodyTypeMap, FuelTypeMap } from "./Models/Car";
import axios from "axios";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import "./CarDetails.css"; 

const API_URL = 'https://localhost:7081/api/Cars';

export default function CarDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [car, setCar] = useState<Car | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getMappedValue = (value: number | string, map: Record<number, any>): string => {
        const numKey = Number(value);
        return map[numKey] || 'Nieznany';
    };

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError('Brak ID samochodu.');
            return;
        }

        const fetchCarById = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                setCar(response.data);
                setError(null);
            } catch (err) {
                setError('Nie znaleziono auta lub błąd serwera.');
            } finally {
                setLoading(false);
            }
        };

        fetchCarById();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`Czy na pewno chcesz usunąć samochód ${car?.brand} ${car?.model}?`)) return;

        try {
            setLoading(true); // Opcjonalnie: pokaż spinner podczas operacji
            await axios.delete(`${API_URL}/${id}`);

            // Po pomyślnym usunięciu, przekierowujemy do listy aut
            alert("Samochód został pomyślnie usunięty.");
            navigate('/cars');
        } catch (err) {
            alert('Błąd podczas usuwania auta. Spróbuj ponownie.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="message-box">
                <p>Ładowanie szczegółów...</p>
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="message-box" style={{ color: 'var(--color-danger)' }}>
                <h2>Błąd</h2>
                <p>{error || 'Brak danych samochodu.'}</p>
                <NavLink to="/cars" className="btn-back">
                    Wróć do listy
                </NavLink>
            </div>
        );
    }

    return (
        <div className="details-container">
            <div className="car-card">
                <div className="card-header">
                    <h2>
                        🚗 {car.brand} {car.model}
                    </h2>
                    <span>Typ nadwozia: {getMappedValue(car.bodyType, BodyTypeMap)}</span>
                </div>

                <div className="card-body">
                    <div>
                        <h3>Specyfikacja Silnika i Paliwa</h3>
                        <ul className="detail-list">
                            <li>
                                <i>🔧</i> <strong>Pojemność Silnika:</strong> {car.engineCapacity} cc
                            </li>
                            <li>
                                <i>🔥</i> <strong>Rodzaj Paliwa:</strong> {getMappedValue(car.fuelType, FuelTypeMap)}
                            </li>
                            <li>
                                <i>⛽</i> <strong>Spalanie:</strong> {car.carFuelConsumption} L/100km
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3>Pozostałe Dane</h3>
                        <ul className="detail-list">
                            <li>
                                <i>🚪</i> <strong>Liczba Drzwi:</strong> {car.doorsNumber}
                            </li>
                            <li>
                                <i>🧳</i> <strong>Pojemność Bagażnika:</strong> {car.luggageCapacity} litrów
                            </li>
                            <li>
                                <i>📅</i> <strong>Data Produkcji:</strong> {new Date(car.productionDate).toLocaleDateString()}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card-footer">
                    <NavLink
                        to="/cars"
                        className="btn-back"
                    >
                        Wróć do listy
                    </NavLink>
                    <NavLink
                        to={`/edit/${car.id}`}
                        className="btn-edit"
                    >
                        Edytuj
                    </NavLink>
                    <button
                        onClick={handleDelete}
                        className="btn-action btn-delete"
                        style={{ margin: 0 }} 
                    >
                        Usuń Samochód
                    </button>
                </div>
            </div>
        </div>
    );
}