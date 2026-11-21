# Деплой и инфраструктура

- Репозиторий: https://github.com/one4sv/one4sv-studio
- Продакшен-ветка: `main`
- Проект: `one4sv-studio` в команде Vercel `one4sv's projects`
- Адрес: https://one4sv-studio.vercel.app/
- `one4sv.studio` — желаемый кастомный домен; DNS и подключение проверять отдельно.

Статический сайт — HTML/CSS/JS без обязательного npm и сборки.

Локально, из корня репозитория:

```sh
python -m http.server 5173
```

Откройте `http://localhost:5173`.

В Vercel использовать Framework Preset = Other, без Build Command и с Output Directory = корень репозитория. Git-интеграция создаёт deployment после push в `main`. Статус READY и доступность нужно проверять отдельно в Vercel.
