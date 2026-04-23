# Используем официальный образ Playwright с Node.js 22 LTS на базе Ubuntu 22.04
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только файлы манифестов для кэширования слоя зависимостей
COPY package.json package-lock.json ./
COPY react-app/package.json ./react-app/
COPY vue-app/package.json ./vue-app/
COPY svelte-app/package.json ./svelte-app/
COPY vanilla-app/package.json ./vanilla-app/
COPY shared/package.json ./shared/

# Устанавливаем зависимости
# --force игнорирует проверки платформ для опциональных пакетов
# --legacy-peer-deps обходит конфликты версий между воркспейсами
RUN npm install --force --legacy-peer-deps

# Копируем исходный код проекта (исключая то, что в .dockerignore)
COPY . .

# Создаём директорию для метрик и даём права на запись
RUN mkdir -p /app/metrics && chmod 777 /app/metrics

# Копируем скрипт точки входа
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Экспортируем порты для документации (опционально)
EXPOSE 5173 5174 5175 5176

# Указываем точку входа
ENTRYPOINT ["docker-entrypoint.sh"]