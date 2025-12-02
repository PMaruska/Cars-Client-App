export enum FuelType {
    Petrol = 'Petrol',
    Hybrid = 'Hybrid',
    Diesel = 'Diesel',
    LPG = 'LPG',
}

export const FuelTypeMap: Record<number, FuelType> = {
    0: FuelType.Petrol,
    1: FuelType.Hybrid,
    2: FuelType.Diesel,
    3: FuelType.LPG
};

export enum BodyType {
    Hatchback = 'Hatchback',
    Sedan = 'Sedan',
    Kombi = 'Kombi',
    SUV = 'SUV',
    Roadster = 'Roadster',
}

export const BodyTypeMap: Record<number, BodyType> = {
    0: BodyType.Hatchback,
    1: BodyType.Sedan,
    2: BodyType.Kombi,
    3: BodyType.SUV,
    4: BodyType.Roadster
};

export interface Car {
    id: string;
    brand: string;
    model: string;
    doorsNumber: number;
    luggageCapacity: number;
    engineCapacity: number;
    fuelType: FuelType;
    productionDate: string; // ISO 8601 string
    carFuelConsumption: number;
    bodyType: BodyType;
}