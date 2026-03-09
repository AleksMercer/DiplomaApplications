import type { Product } from "@shared/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
        loading="lazy"
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.category}</p>
      <p className="text-gray-800 font-bold">{product.price.toFixed(2)} ₽</p>
      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
        {product.description}
      </p>
    </div>
  );
}
