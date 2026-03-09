import { fetchCitiesByCountry } from "@shared/utils";
import { mockCountries } from "@shared/data/mockData";

export function mount(container) {
  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Оформление заказа</h1>
      <form class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Страна</label>
          <select data-testid="country-select" class="w-full px-3 py-2 border rounded-md"></select>
          <p data-err="country" class="text-red-600 text-sm mt-1 hidden"></p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Город</label>
          <select data-testid="city-select" class="w-full px-3 py-2 border rounded-md" disabled></select>
          <p data-err="city" class="text-red-600 text-sm mt-1 hidden"></p>
          <p data-loading class="text-gray-500 text-sm mt-1 hidden">Загрузка городов...</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <input data-testid="name-input" type="text" class="w-full px-3 py-2 border rounded-md" />
          <p data-err="name" class="text-red-600 text-sm mt-1 hidden"></p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input data-testid="email-input" type="email" class="w-full px-3 py-2 border rounded-md" />
          <p data-err="email" class="text-red-600 text-sm mt-1 hidden"></p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
          <input data-testid="phone-input" type="tel" class="w-full px-3 py-2 border rounded-md" />
          <p data-err="phone" class="text-red-600 text-sm mt-1 hidden"></p>
        </div>

        <button data-testid="submit-button" type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Отправить
        </button>
      </form>
    </div>
  `;

  const $form = container.querySelector("form");
  const $country = container.querySelector('[data-testid="country-select"]');
  const $city = container.querySelector('[data-testid="city-select"]');
  const $loading = container.querySelector("[data-loading]");

  const $name = container.querySelector('[data-testid="name-input"]');
  const $email = container.querySelector('[data-testid="email-input"]');
  const $phone = container.querySelector('[data-testid="phone-input"]');

  const form = { country: "", city: "", name: "", email: "", phone: "" };
  const errors = {};

  function setErr(field, text) {
    const el = container.querySelector(`[data-err="${field}"]`);
    if (!el) return;
    if (text) {
      el.textContent = text;
      el.classList.remove("hidden");
    } else {
      el.textContent = "";
      el.classList.add("hidden");
    }
  }

  function fillCountries() {
    $country.innerHTML =
      `<option value="">Выберите страну</option>` +
      mockCountries
        .map((c) => `<option value="${c.code}">${c.name}</option>`)
        .join("");
  }
  function fillCities(list) {
    $city.innerHTML =
      `<option value="">Выберите город</option>` +
      list.map((n) => `<option value="${n}">${n}</option>`).join("");
  }

  fillCountries();
  $city.disabled = true;

  $country.addEventListener("change", async (e) => {
    form.country = e.target.value;
    form.city = "";
    setErr("city", "");
    if (!form.country) {
      $city.disabled = true;
      fillCities([]);
      return;
    }
    $loading.classList.remove("hidden");
    $city.disabled = true;
    const cities = await fetchCitiesByCountry(form.country);
    fillCities(cities);
    $loading.classList.add("hidden");
    $city.disabled = false;
  });

  $city.addEventListener("change", (e) => {
    form.city = e.target.value;
  });

  $name.addEventListener("input", (e) => {
    form.name = e.target.value;
  });
  $email.addEventListener("input", (e) => {
    form.email = e.target.value;
  });
  $phone.addEventListener("input", (e) => {
    form.phone = e.target.value;
  });

  $name.addEventListener("blur", () => validateField("name"));
  $email.addEventListener("blur", () => validateField("email"));
  $phone.addEventListener("blur", () => validateField("phone"));

  function validateField(field) {
    const v = form[field] || "";
    let err = "";
    if (field === "name" && !v.trim()) err = "Имя обязательно";
    else if (field === "email" && v.trim()) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(v)) err = "Некорректный email";
    } else if (field === "phone" && v.trim()) {
      const re = /^[\d\s\+\-\(\)]{7,}$/;
      if (!re.test(v)) err = "Некорректный телефон";
    }
    errors[field] = err;
    setErr(field, err);
  }

  function validateForm() {
    ["country", "city", "name", "email", "phone"].forEach(validateField);
    if (!form.country) setErr("country", "Выберите страну");
    if (!form.city) setErr("city", "Выберите город");
    return Object.values(errors).every((v) => !v) && form.country && form.city;
  }

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Форма отправлена (тест)");
    }
  });

  return () => {};
}
