import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Car, FuelTypeMap, BodyTypeMap } from './Models/Car';
import { NavLink } from 'react-router-dom';
import "./CarList.css";

const API_URL = 'https://localhost:7081/api/cars';
export default function CarList() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getMappedValue = (value: number | string, map: Record<number, any>): string => {
        const numKey = Number(value);
        return map[numKey] || 'Nieznany';
    };

    const fetchCars = () => {
        setLoading(true);
        axios.get<Car[]>(API_URL)
            .then((response) => {
                setCars(response.data);
                setError(null);
            })
            .catch(() => {
                setError('Błąd ładowania danych aut.');
                setCars([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to auto?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            setCars(cars.filter(car => car.id !== id));
        } catch (err) {
            alert('Błąd podczas usuwania auta.');
            console.error(err);
        }
    };

    if (loading) return <div className="list-container">Ładowanie...</div>;
    if (error) return <div className="list-container" style={{ color: 'var(--color-danger)' }}>Błąd: {error}</div>;

    return (
        <div className="list-container">
            <div className="list-header">
                <h1>Lista Samochodów</h1>
            </div>

            <table className="car-table">
                <thead>
                    <tr>
                        <th>Marka/Model</th>
                        <th>Typ Nadwozia</th>
                        <th>Paliwo</th>
                        <th>Data Produkcji</th>
                        <th>Akcje</th>
                    </tr>
                </thead>

                <tbody>
                    {cars.map(car => (
                        <tr key={car.id}>
                            <td><strong>{car.brand} {car.model}</strong></td>
                            <td>{getMappedValue(car.bodyType, BodyTypeMap)}</td>
                            <td>{getMappedValue(car.fuelType, FuelTypeMap)}</td>
                            <td>{new Date(car.productionDate).toLocaleDateString()}</td>
                            <td>
                                <div className="action-buttons">
                                    <NavLink
                                        to={`/cars/${car.id}`}
                                        className="btn-action btn-details"
                                    >
                                        Szczegóły
                                    </NavLink>
                                    <NavLink
                                        to={`/edit/${car.id}`}
                                        className="btn-action btn-edit"
                                    >
                                        Edytuj
                                    </NavLink>
                                    <button
                                        onClick={() => handleDelete(car.id)}
                                        className="btn-action btn-delete"
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}