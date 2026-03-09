<template>
  <div
    class="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
  >
    <img
      :src="product.image"
      :alt="product.name"
      class="w-full h-48 object-cover rounded-md mb-3"
      loading="lazy"
    />
    <h3 class="font-semibold text-lg">{{ product.name }}</h3>
    <p class="text-gray-600 text-sm mb-2">{{ product.category }}</p>
    <p class="text-gray-800 font-bold">{{ product.price.toFixed(2) }} ₽</p>
    <p class="text-gray-500 text-sm mt-2 line-clamp-2">
      {{ product.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@shared/types";

defineProps<{
  product: Product;
}>();
</script>
