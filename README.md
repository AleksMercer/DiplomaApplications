# DiplomaApplications — запуск и сбор метрик

## Предварительно

- Установка зависимостей:
  npm i
- Установка браузеров Playwright (однократно):
  npx playwright install

## Локальный запуск приложений (dev)

- Vue (http://localhost:5173):
  cd vue-app && npm run dev
- React (http://localhost:5174):
  cd react-app && npm run dev
- Svelte (http://localhost:5175):
  cd svelte-app && npm run dev
- Svelte (http://localhost:5176):
  cd vanilla-app && npm run dev

## Запуск автотестов (прод-сборка + preview поднимется автоматически)

- Все проекты и все страницы:
  npx playwright test
- Конкретный проект:
  - Vue: npx playwright test --project=vue-chromium
  - React: npx playwright test --project=react-chromium
  - Svelte: npx playwright test --project=svelte-chromium
  - Vanilla: npx playwright test --project=vanilla-chromium
- Конкретный тест конкретного проекта:
  - Пример (Filter только для Vue):
    npx playwright test tests/filter.spec.ts --project=vue-chromium

## Формат вывода

- В консоль выводится только строка завершения теста:
  - "Vue: Test Load завершен"
  - "Vue: Test Filter завершен"
  - "Vue: Test Form завершен"
    (Аналогично для React/Svelte)

## Где лежат данные для Excel

- Все значения пишутся в один файл CSV:
  metrics/metrics.csv
- Формат строк:
  <Framework>:<Page>:<Metric + unit>:<v1>,<v2>,...,<vN>
  Примеры:
  - Vue:Load:LCP ms:1920,1985,2010
  - Vue:Filter:INP ms:52,48,55
  - Vue:Form:CLS:0.0041,0.0039,0.0040
    Новые прогоны добавляют значения в конец соответствующей строки.

## Многократный прогон

- Повторить каждый тест N раз:
  npx playwright test --repeat-each=20
- Очистить предыдущие результаты:
  удалить файл metrics/metrics.csv

## Скрипты (package.json)

```json
{
  "scripts": {
    "dev:vue": "cd vue-app && npm run dev",
    "dev:react": "cd react-app && npm run dev",
    "dev:svelte": "cd svelte-app && npm run dev",
    "test:all": "npx playwright test",
    "test:vue": "npx playwright test --project=vue-chromium",
    "test:react": "npx playwright test --project=react-chromium",
    "test:svelte": "npx playwright test --project=svelte-chromium",
    "test:vanilla": "npx playwright test --project=vanilla-chromium",
    "test:repeat": "npx playwright test --repeat-each=10"
  }
}
```
