export default function LoadView() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mt-8 mb-4 text-center text-gray-800">
        Добро пожаловать в магазин
      </h1>

      <div className="prose prose-lg mx-auto">
        <p className="mb-4">
          Здесь вы найдёте тысячи товаров по самым низким ценам. Мы работаем с
          ведущими поставщиками и гарантируем качество.
        </p>
        <p className="mb-4">
          Наша платформа использует современные технологии для быстрой и плавной
          работы. Оцените скорость загрузки и удобство интерфейса.
        </p>
        <p className="mb-6">
          Для перехода к каталогу нажмите кнопку ниже или воспользуйтесь меню.
        </p>
      </div>

      <div className="flex justify-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Начать покупки
        </button>
      </div>
    </div>
  );
}
