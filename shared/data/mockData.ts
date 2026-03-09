import { generateProducts, countries, generateCities } from "./generators";

export const mockProducts = generateProducts(1000);
export const mockCountries = countries;
export const mockCities = generateCities();
