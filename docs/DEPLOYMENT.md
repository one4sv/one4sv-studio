# Сборка и публикация

Исходники: https://github.com/one4sv/one4sv-studio, ветка main.
Публикация: Vercel, проект one4sv-studio, адрес https://one4sv-studio.vercel.app/.

## Локально

- npm install
- npm run dev
- npm run build
- npm run preview

Vite формирует каталог dist. Для Vercel: Framework Preset — Vite, Build Command — npm run build, Output Directory — dist. Push в main вызывает production-деплой через Git-интеграцию; предварительные статусы не считаются подтверждением готовности. После пуша сверять production commit SHA и READY, затем открывать страницу.

Сайт не требует секретов и не содержит серверной авторизации. Скриншоты находятся в public/assets.
