import { mockProducts } from "@shared/data/mockData";
import { generateProduct } from "@shared/data/generators";
import { debounce, filterProducts, sortProducts } from "@shared/utils";
import { renderProductCardHTML } from "../components/ProductCard.js";

export function mount(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Каталог товаров</h1>
      <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-50">
          <label class="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
          <input data-testid="search" type="text" placeholder="Название товара..." class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div class="w-48">
          <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
          <select data-testid="category-select" class="w-full px-3 py-2 border rounded-md">
            <option value="">Все категории</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Сортировка</label>
          <select data-testid="sort-select" class="w-full px-3 py-2 border rounded-md">
            <option value="none">Без сортировки</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
          </select>
        </div>
      </div>

      <div id="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"></div>
      <div id="empty" class="text-center py-12 text-gray-500 hidden">Товары не найдены</div>

      <div class="flex justify-center mt-8">
        <button data-testid="load-more" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Загрузить ещё</button>
      </div>
    </div>
  `;

  let allProducts = [...mockProducts];
  let searchInput = "";
  let searchQuery = "";
  let selectedCategory = "";
  let sortBy = "none";
  let isLoading = false;

  const $search = container.querySelector('[data-testid="search"]');
  const $cat = container.querySelector('[data-testid="category-select"]');
  const $sort = container.querySelector('[data-testid="sort-select"]');
  const $grid = container.querySelector("#grid");
  const $empty = container.querySelector("#empty");
  const $more = container.querySelector('[data-testid="load-more"]');

  const debounced = debounce((v) => {
    searchQuery = v;
    update();
  }, 300);

  fillCategories();
  update();

  $search.addEventListener("input", (e) => {
    searchInput = e.target.value;
    debounced(searchInput);
  });
  $cat.addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    update();
  });
  $sort.addEventListener("change", (e) => {
    sortBy = e.target.value;
    update();
  });
  $more.addEventListener("click", () => {
    if (isLoading) return;
    isLoading = true;
    $more.disabled = true;
    setTimeout(() => {
      const newProducts = Array.from({ length: 20 }, generateProduct);
      allProducts = [...allProducts, ...newProducts];
      fillCategories();
      isLoading = false;
      $more.disabled = false;
      update();
    }, 300);
  });

  function fillCategories() {
    const cats = Array.from(new Set(allProducts.map((p) => p.category))).sort();
    const current = $cat.value;
    $cat.innerHTML =
      `<option value="">Все категории</option>` +
      cats
        .map(
          (c) => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`,
        )
        .join("");
    $cat.value = current || "";
  }

  function update() {
    const filtered = sortProducts(
      filterProducts(allProducts, {
        search: searchQuery,
        category: selectedCategory,
        sortBy,
      }),
      sortBy,
    );
    if (filtered.length === 0) {
      $grid.innerHTML = "";
      $empty.classList.remove("hidden");
    } else {
      $empty.classList.add("hidden");
      $grid.innerHTML = filtered.map(renderProductCardHTML).join("");
    }
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  return () => {
    debounced.cancel?.();
  };
}
