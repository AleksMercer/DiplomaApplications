import { useEffect, useState } from "react";
import { mockCountries } from "@shared/data/mockData";
import { fetchCitiesByCountry } from "@shared/utils";

type FormData = {
  country: string;
  city: string;
  name: string;
  email: string;
  phone: string;
};

export default function FormView() {
  const [form, setForm] = useState<FormData>({
    country: "",
    city: "",
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const countries = mockCountries;

  useEffect(() => {
    if (!form.country) {
      setAvailableCities([]);
      setForm((prev) => ({ ...prev, city: "" }));
    }
  }, [form.country]);

  const onCountryChange = async (code: string) => {
    setForm((prev) => ({ ...prev, country: code, city: "" }));
    setErrors((prev) => ({ ...prev, city: "" }));
    if (!code) {
      setAvailableCities([]);
      return;
    }
    setCitiesLoading(true);
    try {
      const cities = await fetchCitiesByCountry(code);
      setAvailableCities(cities);
    } finally {
      setCitiesLoading(false);
    }
  };

  const validateField = (field: keyof FormData) => {
    const value = form[field];
    let error = "";
    if (field === "name" && !value.trim()) {
      error = "Имя обязательно";
    } else if (field === "email" && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Некорректный email";
    } else if (field === "phone" && value.trim()) {
      const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
      if (!phoneRegex.test(value)) error = "Некорректный телефон";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const fields: (keyof FormData)[] = [
      "country",
      "city",
      "name",
      "email",
      "phone",
    ];
    fields.forEach((f) => validateField(f));
    const acc: Record<string, string> = {};
    if (!form.country) acc.country = "Выберите страну";
    if (!form.city) acc.city = "Выберите город";
    setErrors((prev) => ({ ...prev, ...acc }));
    return Object.values({ ...errors, ...acc }).every((v) => !v);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert("Форма отправлена (тест)");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-white p-6 rounded-lg shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Страна
          </label>
          <select
            data-testid="country-select"
            value={form.country}
            onChange={(e) => onCountryChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.country ? "border-red-500" : ""}`}
          >
            <option value="">Выберите страну</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-600 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Город
          </label>
          <select
            data-testid="city-select"
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md ${errors.city ? "border-red-500" : ""}`}
            disabled={!form.country || citiesLoading}
          >
            <option value="">Выберите город</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
          )}
          {citiesLoading && (
            <p className="text-gray-500 text-sm mt-1">Загрузка городов...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя
          </label>
          <input
            data-testid="name-input"
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            onBlur={() => validateField("name")}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            data-testid="email-input"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            onBlur={() => validateField("email")}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <input
            data-testid="phone-input"
            type="tel"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            onBlur={() => validateField("phone")}
            className={`w-full px-3 py-2 border rounded-md ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <button
          data-testid="submit-button"
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
