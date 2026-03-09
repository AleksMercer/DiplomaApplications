import { faker } from "@faker-js/faker";
import type { Product, Country, City } from "../types";

// Фиксируем seed для детерминированных данных
// Можно переопределить через Vite env: VITE_DATA_SEED
const SEED = Number((import.meta as any)?.env?.VITE_DATA_SEED ?? 1);
faker.seed(SEED);

// Фиксированный набор категорий — стабилизирует фильтрацию/сортировку
export const CATEGORIES: string[] = [
  "Электроника",
  "Одежда",
  "Дом",
  "Спорт",
  "Игрушки",
  "Красота",
];

// Локальный SVG-плейсхолдер (без внешних запросов)
function svgPlaceholder(text: string, width = 200, height = 200): string {
  const safeText = (text || "?").slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#e5e7eb"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="42" fill="#6b7280">${safeText}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const generateProduct = (i?: number): Product => {
  const id = faker.string.uuid();
  const name = faker.commerce.productName();
  const price = faker.number.int({ min: 10, max: 9999 });
  const category = faker.helpers.arrayElement(CATEGORIES);
  const image = svgPlaceholder(category, 200, 200);
  const description = faker.commerce.productDescription();
  return { id, name, price, category, image, description };
};

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => generateProduct(i));
};

export const countries: Country[] = [
  { code: "RU", name: "Россия" },
  { code: "US", name: "США" },
  { code: "DE", name: "Германия" },
  { code: "FR", name: "Франция" },
  { code: "IT", name: "Италия" },
  { code: "GB", name: "Великобритания" },
  { code: "CN", name: "Китай" },
  { code: "JP", name: "Япония" },
  { code: "IN", name: "Индия" },
  { code: "BR", name: "Бразилия" },
  { code: "CA", name: "Канада" },
  { code: "AU", name: "Австралия" },
  { code: "MX", name: "Мексика" },
  { code: "ES", name: "Испания" },
  { code: "NL", name: "Нидерланды" },
  { code: "BE", name: "Бельгия" },
  { code: "CH", name: "Швейцария" },
  { code: "AT", name: "Австрия" },
  { code: "SE", name: "Швеция" },
  { code: "NO", name: "Норвегия" },
  { code: "DK", name: "Дания" },
  { code: "FI", name: "Финляндия" },
  { code: "PL", name: "Польша" },
  { code: "CZ", name: "Чехия" },
  { code: "SK", name: "Словакия" },
  { code: "HU", name: "Венгрия" },
  { code: "PT", name: "Португалия" },
  { code: "GR", name: "Греция" },
  { code: "TR", name: "Турция" },
  { code: "IL", name: "Израиль" },
  { code: "SA", name: "Саудовская Аравия" },
  { code: "AE", name: "ОАЭ" },
  { code: "EG", name: "Египет" },
  { code: "ZA", name: "ЮАР" },
  { code: "AR", name: "Аргентина" },
  { code: "CL", name: "Чили" },
  { code: "CO", name: "Колумбия" },
  { code: "PE", name: "Перу" },
  { code: "VE", name: "Венесуэла" },
  { code: "MY", name: "Малайзия" },
  { code: "SG", name: "Сингапур" },
  { code: "TH", name: "Таиланд" },
  { code: "VN", name: "Вьетнам" },
  { code: "PH", name: "Филиппины" },
  { code: "ID", name: "Индонезия" },
  { code: "PK", name: "Пакистан" },
  { code: "BD", name: "Бангладеш" },
  { code: "IR", name: "Иран" },
  { code: "IQ", name: "Ирак" },
  { code: "KW", name: "Кувейт" },
  { code: "QA", name: "Катар" },
  { code: "KZ", name: "Казахстан" },
  { code: "UA", name: "Украина" },
  { code: "BY", name: "Беларусь" },
  { code: "RO", name: "Румыния" },
  { code: "BG", name: "Болгария" },
  { code: "RS", name: "Сербия" },
  { code: "HR", name: "Хорватия" },
  { code: "SI", name: "Словения" },
  { code: "LT", name: "Литва" },
  { code: "LV", name: "Латвия" },
  { code: "EE", name: "Эстония" },
  { code: "IS", name: "Исландия" },
  { code: "LU", name: "Люксембург" },
  { code: "MT", name: "Мальта" },
  { code: "CY", name: "Кипр" },
];

const citiesByCountry: Record<string, string[]> = {
  RU: [
    "Москва",
    "Санкт-Петербург",
    "Казань",
    "Новосибирск",
    "Екатеринбург",
    "Нижний Новгород",
  ],
  US: [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
  ],
  DE: ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart"],
  FR: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes"],
  IT: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Bologna"],
  GB: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Glasgow"],
  CN: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Tianjin"],
  JP: ["Tokyo", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe"],
  IN: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"],
  BR: [
    "São Paulo",
    "Rio de Janeiro",
    "Brasília",
    "Salvador",
    "Fortaleza",
    "Belo Horizonte",
  ],
  CA: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
  MX: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León"],
  ES: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga"],
  NL: [
    "Amsterdam",
    "Rotterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Groningen",
  ],
  BE: ["Brussels", "Antwerp", "Ghent", "Bruges", "Liège", "Namur"],
  CH: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Lucerne"],
  AT: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt"],
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro"],
  NO: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad"],
  DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers"],
  FI: ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu", "Lahti"],
  PL: ["Warsaw", "Krakow", "Wroclaw", "Poznan", "Gdańsk", "Łódź"],
  CZ: ["Prague", "Brno", "Ostrava", "Pilsen", "Liberec", "Olomouc"],
  SK: ["Bratislava", "Košice", "Prešov", "Žilina", "Banská Bystrica", "Nitra"],
  HU: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr"],
  PT: ["Lisbon", "Porto", "Braga", "Coimbra", "Funchal", "Amadora"],
  GR: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos"],
  TR: ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa", "Adana"],
  IL: [
    "Jerusalem",
    "Tel Aviv",
    "Haifa",
    "Rishon LeZion",
    "Petah Tikva",
    "Ashdod",
  ],
  SA: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah"],
  EG: ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said", "Suez"],
  ZA: [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
  ],
  AR: [
    "Buenos Aires",
    "Córdoba",
    "Rosario",
    "Mendoza",
    "La Plata",
    "San Miguel de Tucumán",
  ],
  CL: [
    "Santiago",
    "Valparaíso",
    "Concepción",
    "La Serena",
    "Antofagasta",
    "Rancagua",
  ],
  CO: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta"],
  PE: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Cusco"],
  VE: [
    "Caracas",
    "Maracaibo",
    "Valencia",
    "Barquisimeto",
    "Maracay",
    "Ciudad Guayana",
  ],
  MY: [
    "Kuala Lumpur",
    "George Town",
    "Ipoh",
    "Johor Bahru",
    "Shah Alam",
    "Malacca City",
  ],
  SG: [
    "Singapore",
    "Jurong East",
    "Woodlands",
    "Tampines",
    "Pasir Ris",
    "Ang Mo Kio",
  ],
  TH: [
    "Bangkok",
    "Nonthaburi",
    "Nakhon Ratchasima",
    "Chiang Mai",
    "Hat Yai",
    "Udon Thani",
  ],
  VN: [
    "Ho Chi Minh City",
    "Hanoi",
    "Da Nang",
    "Haiphong",
    "Can Tho",
    "Nha Trang",
  ],
  PH: ["Manila", "Quezon City", "Davao", "Cebu City", "Zamboanga", "Taguig"],
  ID: ["Jakarta", "Surabaya", "Bandung", "Medan", "Bekasi", "Semarang"],
  PK: ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala"],
  BD: ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal"],
  IR: ["Tehran", "Mashhad", "Isfahan", "Shiraz", "Tabriz", "Karaj"],
  IQ: ["Baghdad", "Basra", "Mosul", "Erbil", "Kirkuk", "Najaf"],
  KW: [
    "Kuwait City",
    "Hawalli",
    "Salmiya",
    "Farwaniya",
    "Jahra",
    "Sabah Al-Salem",
  ],
  QA: ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Umm Salal", "Al Daayen"],
  KZ: ["Алматы", "Нур-Султан", "Шымкент", "Караганда", "Актобе", "Тараз"],
  UA: ["Киев", "Харьков", "Одесса", "Днепр", "Донецк", "Запорожье"],
  BY: ["Минск", "Гомель", "Могилёв", "Витебск", "Гродно", "Брест"],
  RO: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova"],
  BG: ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora"],
  RS: ["Belgrade", "Novi Sad", "Niš", "Subotica", "Kragujevac", "Pančevo"],
  HR: ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Dubrovnik"],
  SI: ["Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper"],
  LT: ["Вильнюс", "Каунас", "Клайпеда", "Шяуляй", "Паневежис", "Алитус"],
  LV: ["Рига", "Даугавпилс", "Лиепая", "Елгава", "Юрмала", "Вентспилс"],
  EE: ["Таллин", "Тарту", "Нарва", "Пярну", "Кохтла-Ярве", "Вильянди"],
  IS: [
    "Reykjavík",
    "Kópavogur",
    "Hafnarfjörður",
    "Akureyri",
    "Reykjanesbær",
    "Garðabær",
  ],
  LU: [
    "Luxembourg",
    "Esch-sur-Alzette",
    "Differdange",
    "Dudelange",
    "Ettelbruck",
    "Diekirch",
  ],
  MT: ["Valletta", "Birkirkara", "Mosta", "Sliema", "Qormi", "Żabbar"],
  CY: ["Nicosia", "Limassol", "Larnaca", "Famagusta", "Paphos", "Kyrenia"],
};

export const generateCities = (): City[] => {
  const cities: City[] = [];
  countries.forEach((country) => {
    const cityNames = citiesByCountry[country.code] || [];
    cityNames.forEach((cityName) => {
      cities.push({
        id: `${country.code}-${cityName}`,
        name: cityName,
        countryCode: country.code,
      });
    });
  });
  return cities;
};
