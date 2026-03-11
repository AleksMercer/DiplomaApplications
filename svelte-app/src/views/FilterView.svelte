<script lang="ts">
  import { onDestroy } from 'svelte'
  import { mockProducts } from '@shared/data/mockData'
  import { generateProduct } from '@shared/data/generators'
  import { debounce, filterProducts, sortProducts } from '@shared/utils'
  import type { FilterOptions, Product } from '@shared/types'
  import ProductCard from '../components/ProductCard.svelte'

  let allProducts: Product[] = [...mockProducts]
  let searchInput = ''
  let searchQuery = ''
  let selectedCategory = ''
  let sortBy: FilterOptions['sortBy'] = 'none'
  let isLoading = false

  const debouncedSetSearch = debounce((v: string) => { searchQuery = v }, 300)
  onDestroy(() => debouncedSetSearch.cancel?.())

  $: categories = Array.from(new Set(allProducts.map(p => p.category))).sort()

  $: filteredProducts = (() => {
    const filtered = filterProducts(allProducts, {
      search: searchQuery,
      category: selectedCategory,
      sortBy,
    })
    return sortProducts(filtered, sortBy)
  })()

  function onSearchInput(e: Event) {
    const target = e.target as HTMLInputElement
    searchInput = target.value
    debouncedSetSearch(target.value)
  }

  function loadMore() {
    if (isLoading) return
    isLoading = true
    setTimeout(() => {
      const newProducts = Array.from({ length: 20 }, generateProduct)
      allProducts = [...allProducts, ...newProducts]
      isLoading = false
    }, 300)
  }

  const IDS = {
    search: 'filter-search',
    category: 'filter-category',
    sort: 'filter-sort',
  }
</script>

<div class="max-w-7xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Каталог товаров</h1>

  <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end">
    <div class="flex-1 min-w-50">
      <label for={IDS.search} class="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
      <input
        id={IDS.search}
        data-testid="search"
        type="text"
        on:input={onSearchInput}
        placeholder="Название товара..."
        class="w-full px-3 py-2 border rounded-md"
        bind:value={searchInput}
      />
    </div>

    <div class="w-48">
      <label for={IDS.category} class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
      <select
        id={IDS.category}
        data-testid="category-select"
        class="w-full px-3 py-2 border rounded-md"
        bind:value={selectedCategory}
      >
        <option value="">Все категории</option>
        {#each categories as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for={IDS.sort} class="block text-sm font-medium text-gray-700 mb-1">Сортировка</label>
      <select
        id={IDS.sort}
        data-testid="sort-select"
        class="w-full px-3 py-2 border rounded-md"
        bind:value={sortBy}
      >
        <option value="none">Без сортировки</option>
        <option value="price-asc">Цена: по возрастанию</option>
        <option value="price-desc">Цена: по убыванию</option>
      </select>
    </div>
  </div>

  {#if filteredProducts.length}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each filteredProducts as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-12 text-gray-500">Товары не найдены</div>
  {/if}

  <div class="flex justify-center mt-8">
    <button
      data-testid="load-more"
      on:click={loadMore}
      class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      disabled={isLoading}
    >
      {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
    </button>
  </div>
</div>