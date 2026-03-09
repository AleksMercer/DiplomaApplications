import { useEffect, useMemo, useRef, useState } from "react";
import { mockProducts } from "@shared/data/mockData";
import { generateProduct } from "@shared/data/generators";
import { debounce, filterProducts, sortProducts } from "@shared/utils";
import type { FilterOptions, Product } from "@shared/types";
import ProductCard from "../components/ProductCard";

export default function FilterView() {
  const [allProducts, setAllProducts] = useState<Product[]>(() => [
    ...mockProducts,
  ]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<FilterOptions["sortBy"]>("none");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedRef = useRef(debounce((v: string) => setSearchQuery(v), 300));
  useEffect(() => () => debouncedRef.current.cancel?.(), []);

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(allProducts, {
      search: searchQuery,
      category: selectedCategory,
      sortBy,
    });
    return sortProducts(filtered, sortBy);
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchInput(v);
    debouncedRef.current(v);
  };

  const loadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      const newProducts = Array.from({ length: 20 }, generateProduct);
      // добавляем в конец списка, чтобы не провоцировать CLS
      setAllProducts((prev) => [...prev, ...newProducts]);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Поиск
          </label>
          <input
            data-testid="search"
            type="text"
            value={searchInput}
            onChange={onSearchInput}
            placeholder="Название товара..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Категория
          </label>
          <select
            data-testid="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сортировка
          </label>
          <select
            data-testid="sort-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as FilterOptions["sortBy"])
            }
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="none">Без сортировки</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">Товары не найдены</div>
      )}

      <div className="flex justify-center mt-8">
        <button
          data-testid="load-more"
          onClick={loadMore}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Загрузить ещё"}
        </button>
      </div>
    </div>
  );
}
