# Архитектура

one4sv.studio — независимая статическая витрина, не часть AT и без бэкенда.

- `index.html` — шапка, hero, меню проектов, секции Achieve Together и Localhost Manager, будущие проекты, footer, модальное окно.
- `css/style.css` — переменные и адаптивная стилизация.
- `js/app.js` — переключение темы, галерея, диалог и активный пункт навигации.
- `assets/at-*.webp` — снимки Achieve Together; `assets/localhost-manager.webp` — реальный снимок Localhost Manager.
- `assets/favicon.svg` — значок сайта.
- `docs/` — документация.

Тема хранится по ключу `one4sv-studio-theme` в `localStorage`. Значение `auto` удаляет `data-theme` с `<html>`, включая `prefers-color-scheme`. Кнопка открывает список вариантов и не циклически переключает тему.

Галерея Achieve Together хранит массив скриншотов и единый индекс. Стрелки, мини-вкладки, `dialog` и клавиши стрелок используют общий индекс. Изображения не обрезаются.

Проекты oneVault, Atrium и let's Meet показаны как замороженные/будущие; oneAcc — концепт. Функции авторизации не заявлять как готовые.
