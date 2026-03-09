<script lang="ts">
  import { fetchCitiesByCountry } from '@shared/utils'
  import { mockCountries } from '@shared/data/mockData'

  type FormData = {
    country: string
    city: string
    name: string
    email: string
    phone: string
  }

  let form: FormData = { country: '', city: '', name: '', email: '', phone: '' }
  let errors: Record<string, string> = {}
  let citiesLoading = false
  let availableCities: string[] = []
  const countries = mockCountries

  async function onCountryChange(code: string) {
    form = { ...form, country: code, city: '' }
    errors = { ...errors, city: '' }
    if (!code) {
      availableCities = []
      return
    }
    citiesLoading = true
    try {
      const cities = await fetchCitiesByCountry(code)
      availableCities = cities
    } finally {
      citiesLoading = false
    }
  }

  function validateField(field: keyof FormData) {
    const value = form[field]
    let error = ''
    if (field === 'name' && !value.trim()) error = 'Имя обязательно'
    else if (field === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) error = 'Некорректный email'
    } else if (field === 'phone' && value.trim()) {
      const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/
      if (!phoneRegex.test(value)) error = 'Некорректный телефон'
    }
    errors = { ...errors, [field]: error }
  }

  function validateForm(): boolean {
    ;(['country', 'city', 'name', 'email', 'phone'] as (keyof FormData)[])
      .forEach(f => validateField(f))
    const extra: Record<string, string> = {}
    if (!form.country) extra.country = 'Выберите страну'
    if (!form.city) extra.city = 'Выберите город'
    errors = { ...errors, ...extra }
    return Object.values(errors).every(v => !v)
  }

  function handleSubmit() {
    if (validateForm()) {
      alert('Форма отправлена (тест)')
    }
  }
</script>

<div class="max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Оформление заказа</h1>

  <form class="bg-white p-6 rounded-lg shadow-sm space-y-4" on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="country-select" class="block text-sm font-medium text-gray-700 mb-1">Страна</label>
      <select
        id="country-select"
        data-testid="country-select"
        class="w-full px-3 py-2 border rounded-md {errors.country ? 'border-red-500' : ''}"
        bind:value={form.country}
        on:change={(e) => onCountryChange((e.target as HTMLSelectElement).value)}
      >
        <option value="">Выберите страну</option>
        {#each countries as c}
          <option value={c.code}>{c.name}</option>
        {/each}
      </select>
      {#if errors.country}<p class="text-red-600 text-sm mt-1">{errors.country}</p>{/if}
    </div>

    <div>
      <label for="city-select" class="block text-sm font-medium text-gray-700 mb-1">Город</label>
      <select
        id="city-select"
        data-testid="city-select"
        class="w-full px-3 py-2 border rounded-md {errors.city ? 'border-red-500' : ''}"
        bind:value={form.city}
        disabled={!form.country || citiesLoading}
      >
        <option value="">Выберите город</option>
        {#each availableCities as city}
          <option value={city}>{city}</option>
        {/each}
      </select>
      {#if errors.city}<p class="text-red-600 text-sm mt-1">{errors.city}</p>{/if}
      {#if citiesLoading}<p class="text-gray-500 text-sm mt-1">Загрузка городов...</p>{/if}
    </div>

    <div>
      <label for="name-input" class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
      <input
        id="name-input"
        data-testid="name-input"
        type="text"
        class="w-full px-3 py-2 border rounded-md {errors.name ? 'border-red-500' : ''}"
        bind:value={form.name}
        on:blur={() => validateField('name')}
      />
      {#if errors.name}<p class="text-red-600 text-sm mt-1">{errors.name}</p>{/if}
    </div>

    <div>
      <label for="email-input" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        id="email-input"
        data-testid="email-input"
        type="email"
        class="w-full px-3 py-2 border rounded-md {errors.email ? 'border-red-500' : ''}"
        bind:value={form.email}
        on:blur={() => validateField('email')}
      />
      {#if errors.email}<p class="text-red-600 text-sm mt-1">{errors.email}</p>{/if}
    </div>

    <div>
      <label for="phone-input" class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
      <input
        id="phone-input"
        data-testid="phone-input"
        type="tel"
        class="w-full px-3 py-2 border rounded-md {errors.phone ? 'border-red-500' : ''}"
        bind:value={form.phone}
        on:blur={() => validateField('phone')}
      />
      {#if errors.phone}<p class="text-red-600 text-sm mt-1">{errors.phone}</p>{/if}
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