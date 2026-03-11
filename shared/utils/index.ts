import type { Product, FilterOptions } from "../types";
import { mockCities } from "../data/mockData";

export const filterProducts = (
  products: Product[],
  options: FilterOptions,
): Product[] => {
  const search = (options.search || "").trim().toLowerCase();
  const category = (options.category || "").trim();

  return products.filter((product) => {
    const matchesSearch =
      search === "" || product.name.toLowerCase().includes(search);
    const matchesCategory = category === "" || product.category === category;
    return matchesSearch && matchesCategory;
  });
};

export const sortProducts = (
  products: Product[],
  sortBy: FilterOptions["sortBy"],
): Product[] => {
  const arr = [...products];
  if (sortBy === "price-asc") return arr.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") return arr.sort((a, b) => b.price - a.price);
  return arr;
};

type Debounced<T extends (...args: any[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
  flush: () => void;
};

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): Debounced<T> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn(...(lastArgs as Parameters<T>));
      lastArgs = null;
    }, delay);
  }) as Debounced<T>;

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      fn(...(lastArgs as Parameters<T>));
      lastArgs = null;
    }
  };

  return debounced;
};

export const fetchCitiesByCountry = (
  countryCode: string,
): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cities = mockCities
        .filter((city) => city.countryCode === countryCode)
        .map((city) => city.name);
      resolve(cities);
    }, 800);
  });
};
