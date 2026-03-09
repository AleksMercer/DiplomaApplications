export function renderProductCardHTML(p) {
  const price = Number.isFinite(p.price) ? p.price.toFixed(2) : String(p.price);
  return `
    <div class="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
      <img src="${p.image}" alt="${escapeHTML(p.name)}" class="w-full h-48 object-cover rounded-md mb-3" loading="lazy" />
      <h3 class="font-semibold text-lg">${escapeHTML(p.name)}</h3>
      <p class="text-gray-600 text-sm mb-2">${escapeHTML(p.category)}</p>
      <p class="text-gray-800 font-bold">${price} ₽</p>
      <p class="text-gray-500 text-sm mt-2 line-clamp-2">${escapeHTML(p.description)}</p>
    </div>
  `;
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
