<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Оформление заказа</h1>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white p-6 rounded-lg shadow-sm space-y-4"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Страна
        </label>
        <select
          data-testid="country-select"
          v-model="form.country"
          @change="onCountryChange"
          class="w-full px-3 py-2 border rounded-md"
          :class="{ 'border-red-500': errors.country }"
        >
          <option value="">Выберите страну</option>
          <option
            v-for="country in countries"
            :key="country.code"
            :value="country.code"
          >
            {{ country.name }}
          </option>
        </select>
        <p v-if="errors.country" class="text-red-600 text-sm mt-1">
          {{ errors.country }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Город</label
        >
        <select
          data-testid="city-select"
          v-model="form.city"
          class="w-full px-3 py-2 border rounded-md"
          :class="{ 'border-red-500': errors.city }"
          :disabled="!form.country || citiesLoading"
        >
          <option value="">Выберите город</option>
          <option v-for="city in availableCities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
        <p v-if="errors.city" class="text-red-600 text-sm mt-1">
          {{ errors.city }}
        </p>
        <p v-if="citiesLoading" class="text-gray-500 text-sm mt-1">
          Загрузка городов...
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
        <input
          data-testid="name-input"
          type="text"
          v-model="form.name"
          @blur="validateField('name')"
          class="w-full px-3 py-2 border rounded-md"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-red-600 text-sm mt-1">
          {{ errors.name }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          data-testid="email-input"
          type="email"
          v-model="form.email"
          @blur="validateField('email')"
          class="w-full px-3 py-2 border rounded-md"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-red-600 text-sm mt-1">
          {{ errors.email }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Телефон</label
        >
        <input
          data-testid="phone-input"
          type="tel"
          v-model="form.phone"
          @blur="validateField('phone')"
          class="w-full px-3 py-2 border rounded-md"
          :class="{ 'border-red-500': errors.phone }"
        />
        <p v-if="errors.phone" class="text-red-600 text-sm mt-1">
          {{ errors.phone }}
        </p>
      </div>

      <button
        data-testid="submit-button"
        type="submit"
        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Отправить
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { mockCountries } from "@shared/data/mockData";
import { fetchCitiesByCountry } from "@shared/utils";

interface FormData {
  country: string;
  city: string;
  name: string;
  email: string;
  phone: string;
}

const form = ref<FormData>({
  country: "",
  city: "",
  name: "",
  email: "",
  phone: "",
});

const errors = ref<Record<string, string>>({});
const citiesLoading = ref(false);
const availableCities = ref<string[]>([]);

const countries = mockCountries;

const onCountryChange = async () => {
  form.value.city = "";
  errors.value.city = "";
  if (!form.value.country) {
    availableCities.value = [];
    return;
  }

  citiesLoading.value = true;
  try {
    const cities = await fetchCitiesByCountry(form.value.country);
    availableCities.value = cities;
  } finally {
    citiesLoading.value = false;
  }
};

const validateField = (field: keyof FormData) => {
  const value = form.value[field];
  let error = "";

  if (field === "name" && !value.trim()) {
    error = "Имя обязательно";
  } else if (field === "email" && value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      error = "Некорректный email";
    }
  } else if (field === "phone" && value.trim()) {
    const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
    if (!phoneRegex.test(value)) {
      error = "Некорректный телефон";
    }
  }

  errors.value[field] = error;
};

const validateForm = (): boolean => {
  const fields: (keyof FormData)[] = [
    "country",
    "city",
    "name",
    "email",
    "phone",
  ];
  fields.forEach((field) => validateField(field));

  if (!form.value.country) {
    errors.value.country = "Выберите страну";
  }
  if (!form.value.city) {
    errors.value.city = "Выберите город";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (validateForm()) {
    alert("Форма отправлена (тест)");
  }
};
</script>
