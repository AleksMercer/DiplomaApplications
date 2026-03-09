<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Каталог товаров</h1>

    <div
      class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end"
    >
      <div class="flex-1 min-w-50">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Поиск</label
        >
        <input
          data-testid="search"
          type="text"
          :value="searchInput"
          @input="onSearchInput"
          placeholder="Название товара..."
          class="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div class="w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Категория</label
        >
        <select
          data-testid="category-select"
          v-model="selectedCategory"
          class="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Все категории</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Сортировка</label
        >
        <select
          data-testid="sort-select"
          v-model="sortBy"
          class="w-full px-3 py-2 border rounded-md"
        >
          <option value="none">Без сортировки</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
        </select>
      </div>
    </div>

    <div
      v-if="filteredProducts.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
    <div v-else class="text-center py-12 text-gray-500">Товары не найдены</div>

    <div class="flex justify-center mt-8">
      <button
        data-testid="load-more"
        @click="loadMore"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        :disabled="isLoading"
      >
        {{ isLoading ? "Загрузка..." : "Загрузить ещё" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { mockProducts } from "@shared/data/mockData";
import { generateProduct } from "@shared/data/generators";
import { filterProducts, sortProducts, debounce } from "@shared/utils";
import type { Product, FilterOptions } from "@shared/types";
import ProductCard from "../components/ProductCard.vue";

const allProducts = ref<Product[]>([...mockProducts]);

const searchInput = ref("");
const searchQuery = ref("");
const selectedCategory = ref("");
const sortBy = ref<FilterOptions["sortBy"]>("none");

const debouncedSetSearch = debounce((value: string) => {
  searchQuery.value = value;
}, 300);

const onSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  searchInput.value = target.value;
  debouncedSetSearch(target.value);
};

const categories = computed(() => {
  const cats = new Set(allProducts.value.map((p) => p.category));
  return Array.from(cats).sort();
});

const filteredProducts = computed(() => {
  let filtered = filterProducts(allProducts.value, {
    search: searchQuery.value,
    category: selectedCategory.value,
    sortBy: sortBy.value,
  });
  filtered = sortProducts(filtered, sortBy.value);
  return filtered;
});

const isLoading = ref(false);

const loadMore = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  setTimeout(() => {
    const newProducts = Array.from({ length: 20 }, generateProduct);
    allProducts.value = [...allProducts.value, ...newProducts];
    isLoading.value = false;
  }, 300);
};
</script>
