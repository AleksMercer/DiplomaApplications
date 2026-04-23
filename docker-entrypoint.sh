#!/bin/bash
set -e

echo "[INFO] Запуск экспериментального стенда..."

# Переходим в корень проекта
cd /app

# Собираем все приложения в продакшн-режиме
# Используем --if-present для безопасности, если в каком-то пакете скрипт отсутствует
echo "[BUILD] Сборка приложений..."
npm run build --workspaces --if-present

# Функция ожидания доступности порта
wait_for_port() {
  local port=$1
  local name=$2
  local max_attempts=30
  local attempt=1
  
  echo "[WAIT] Ожидание ${name} на порту ${port}..."
  while [ $attempt -le $max_attempts ]; do
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${port}" | grep -q "200"; then
      echo "[OK] ${name} готов (порт ${port})"
      return 0
    fi
    sleep 1
    attempt=$((attempt + 1))
  done
  echo "[ERROR] Таймаут ожидания ${name} на порту ${port}"
  return 1
}

# Запускаем preview-серверы для каждого приложения в фоновом режиме
# strictPort гарантирует, что сервер займёт именно указанный порт
echo "[SERVER] Запуск веб-серверов..."
npm run preview --workspace=vue-app -- --port=5173 --strictPort &
npm run preview --workspace=react-app -- --port=5174 --strictPort &
npm run preview --workspace=svelte-app -- --port=5175 --strictPort &
npm run preview --workspace=vanilla-app -- --port=5176 --strictPort &

# Даём время на инициализацию процессов
sleep 3

# Ждём готовности всех серверов по health-check
wait_for_port 5173 "Vue"
wait_for_port 5174 "React"
wait_for_port 5175 "Svelte"
wait_for_port 5176 "Vanilla"

echo "[TEST] Запуск сценариев браузерной автоматизации..."

# Запускаем Playwright-тесты
# --reporter=line даёт компактный вывод в консоль
# Конфигурация throttle.ts подхватится автоматически и применит эмуляцию сети/CPU
npx playwright test --reporter=line

# Фиксируем завершение и путь к результатам
echo "[DONE] Эксперимент завершён."
echo "[CSV] Результаты сохранены в: /app/metrics/metrics.csv"

# Завершаем процесс с кодом успеха
exit 0