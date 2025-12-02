import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { Car, FuelType, BodyType, FuelTypeMap, BodyTypeMap } from './Models/Car';
import axios from 'axios';
import "./CarForm.css"; 

const API_URL = 'https://localhost:7081/api/Cars';

const initialCar: Car = {
    id: '', 
    brand: '',
    model: '',
    doorsNumber: 2,
    luggageCapacity: 100,
    engineCapacity: 1000,
    fuelType: FuelType.Petrol,
    productionDate: new Date().toISOString().split('T')[0],
    carFuelConsumption: 5.0,
    bodyType: BodyType.Hatchback,
};

const createReverseMap = (map: Record<number, any>): Record<string, number> => {
    const reverseMap: Record<string, number> = {};
    for (const key in map) {
        if (map.hasOwnProperty(key)) {
            reverseMap[map[key] as string] = Number(key);
        }
    }
    return reverseMap;
};

const fuelTypeReverseMap = createReverseMap(FuelTypeMap);
const bodyTypeReverseMap = createReverseMap(BodyTypeMap);

const fuelTypeOptions = Object.values(FuelType);
const bodyTypeOptions = Object.values(BodyType);

export default function CarForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = id !== 'new' && id !== undefined;

    const [car, setCar] = useState<Car>(isEditMode ? undefined! : initialCar);
    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchCarById = async () => {
                try {
                    const response = await axios.get(`${API_URL}/${id}`);
                    const fetchedCar: Car = response.data;
                    fetchedCar.fuelType = FuelTypeMap[Number(fetchedCar.fuelType)] || fetchedCar.fuelType;
                    fetchedCar.bodyType = BodyTypeMap[Number(fetchedCar.bodyType)] || fetchedCar.bodyType;
                    fetchedCar.productionDate = fetchedCar.productionDate.slice(0, 10);
                    setCar(fetchedCar);
                    setError(null);
                } catch (err) {
                    setError('Błąd ładowania danych auta do edycji. Upewnij się, że ID jest poprawne.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCarById();
        } else {
            setLoading(false);
        }
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!car) return;

        const { name, value, type } = e.target;
        let finalValue: string | number = value;

        if (e.target.attributes.getNamedItem('type')?.value === 'number') {
            finalValue = parseFloat(value);
        }

        setCar(prevCar => ({
            ...prevCar!,
            [name]: finalValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!car) return;

        setSubmitting(true);
        setError(null);

        const carToSend = {
            ...car,
            fuelType: fuelTypeReverseMap[car.fuelType as string],
            bodyType: bodyTypeReverseMap[car.bodyType as string],
            productionDate: car.productionDate.slice(0, 10)
        };
        
        if (carToSend.fuelType === undefined || carToSend.bodyType === undefined) {
             setError("Błąd: Nie udało się zmapować nazwy typu paliwa/nadwozia na indeks liczbowy.");
             setSubmitting(false);
             return;
        }

        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/${car.id}`, carToSend);
                alert('Pomyślnie zaktualizowano auto!');
            } else {
                // CREATE (POST)
                const newCarToSend = { ...carToSend, id: undefined! }; 
                const response = await axios.post<Car>(API_URL, newCarToSend);
                alert('Pomyślnie dodano nowe auto!');
                navigate(`/cars/${response.data.id}`);
                return;
            }
            navigate(`/cars/${car.id}`);

        }   catch (err: any) {
            if (axios.isAxiosError(err) && err.response && err.response.status === 400) {

                const errorData = err.response.data;
                let validationMessages: string[] = [];

                if (errorData.errors) {
                    for (const key in errorData.errors) {
                        if (errorData.errors.hasOwnProperty(key)) {
                            validationMessages.push(...errorData.errors[key].map((msg: string) => `${msg}`));
                        }
                    }
                }

                if (validationMessages.length > 0) {
                    setError(`Błąd: ${validationMessages.join('; ')}`);
                } else {
                    setError('Wystąpił nieoczekiwany błąd serwera lub sieci.');
                }

            } else {
                setError('Wystąpił nieoczekiwany błąd serwera lub sieci.');
            }

        } finally {
        setSubmitting(false);
    }
    };

    if (loading) return (
        <div className="message-box">
            <p>Ładowanie danych auta...</p>
        </div>
    );

    if (!car) {
        return (
            <div className="message-box" style={{ color: 'var(--color-danger)' }}>
                <h2>Brak Danych</h2>
                <p>Nie udało się załadować danych auta.</p>
                <NavLink to="/cars" className="btn-cancel">Wróć do listy</NavLink>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h2>{isEditMode ? 'Edycja Samochodu' : 'Dodawanie Nowego Samochodu'}</h2>

            {error && (
                <div className="alert-error">
                    <p> Błąd Formularza: {error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className={submitting ? 'loading' : ''}>

                <div className="form-group">
                    <div className="form-control">
                        <label htmlFor="brand">Marka:</label>
                        <input type="text" id="brand" name="brand" value={car.brand} onChange={handleChange} required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="model">Model:</label>
                        <input type="text" id="model" name="model" value={car.model} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-control">
                        <label htmlFor="doorsNumber">Liczba Drzwi:</label>
                        <input type="number" id="doorsNumber" name="doorsNumber" value={car.doorsNumber} onChange={handleChange} min={1} required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="luggageCapacity">Pojemność Bagażnika (litry):</label>
                        <input type="number" id="luggageCapacity" name="luggageCapacity" value={car.luggageCapacity} onChange={handleChange} min={0} required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="engineCapacity">Pojemność Silnika (cc):</label>
                        <input type="number" id="engineCapacity" name="engineCapacity" value={car.engineCapacity} onChange={handleChange} min={1} required />
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-control">
                        <label htmlFor="fuelType">Rodzaj Paliwa:</label>
                        <select id="fuelType" name="fuelType" value={car.fuelType} onChange={handleChange} required>
                            <option value="" disabled>Wybierz paliwo</option>
                            {fuelTypeOptions.map(fuel => (
                                <option key={fuel} value={fuel}>{fuel}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control">
                        <label htmlFor="bodyType">Typ Nadwozia:</label>
                        <select id="bodyType" name="bodyType" value={car.bodyType} onChange={handleChange} required>
                            <option value="" disabled>Wybierz nadwozie</option>
                            {bodyTypeOptions.map(body => (
                                <option key={body} value={body}>{body}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-control">
                        <label htmlFor="productionDate">Data Produkcji:</label>
                        <input type="date" id="productionDate" name="productionDate" value={car.productionDate} onChange={handleChange} required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="carFuelConsumption">Spalanie (L/100km):</label>
                        <input type="number" step="0.1" id="carFuelConsumption" name="carFuelConsumption" value={car.carFuelConsumption} onChange={handleChange} min={0} required />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'Zapisywanie...' : isEditMode ? 'Zapisz Zmiany' : 'Dodaj Samochód'}
                    </button>
                    <button
                        type='button'
                        className="btn-cancel"
                        onClick={() => isEditMode ? navigate(`/cars/${car.id}`) : navigate('/cars')}
                        disabled={submitting}
                    >
                        Anuluj
                    </button>
                </div>
            </form>
        </div>
    );
}