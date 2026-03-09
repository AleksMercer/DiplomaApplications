export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export interface FilterOptions {
  search: string;
  category: string;
  sortBy: "price-asc" | "price-desc" | "none";
}

export interface Country {
  code: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
}

export interface FormData {
  country: string;
  city: string;
  name: string;
  email: string;
  phone: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}
