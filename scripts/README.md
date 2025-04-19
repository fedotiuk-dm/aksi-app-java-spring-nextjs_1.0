# Посібник з імпорту прайс-листа

Цей посібник описує процес імпорту даних прайс-листа в базу даних PostgreSQL.

## Передумови

1. База даних PostgreSQL 17.x
2. Доступ до pgAdmin або іншого SQL клієнта
3. Створені таблиці service_categories та price_list_items

## Кроки імпорту

### 1. Підготовка таблиць

Переконайтеся, що необхідні таблиці вже створені на бекенді. Вони мають бути створені автоматично через міграції Liquibase при першому запуску Spring Boot додатка.

### 2. Імпорт даних

1. Відкрийте pgAdmin та підключіться до вашої бази даних.
2. Натисніть правою кнопкою миші на вашу базу даних і виберіть **Query Tool**.
3. Відкрийте SQL файл `import_price_list.sql` з директорії `scripts/`.
4. Виконайте SQL скрипт, натиснувши **Execute/Refresh (F5)**.

### 3. Перевірка імпорту

Після виконання скрипту ви можете перевірити, що дані були успішно імпортовані, виконавши наступні запити:

```sql
-- Перевірка кількості категорій
SELECT COUNT(*) FROM service_categories;

-- Перевірка кількості позицій прайс-листа
SELECT COUNT(*) FROM price_list_items;

-- Перегляд категорій з кількістю позицій у кожній
SELECT sc.name, COUNT(pli.id) AS items_count
FROM service_categories sc
LEFT JOIN price_list_items pli ON pli.category_id = sc.id
GROUP BY sc.name
ORDER BY sc.sort_order;
```

## Додавання нових даних до прайс-листа

Для додавання нових категорій та позицій прайс-листа можна використовувати наступний шаблон:

```sql
-- Додавання нової категорії
INSERT INTO service_categories (id, code, name, description, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), 'new_category_code', 'Назва нової категорії', 'Опис категорії', 10, now(), now());

-- Отримання ID нової категорії
DO $$
DECLARE
    new_category_id UUID;
BEGIN
    SELECT id INTO new_category_id FROM service_categories WHERE code = 'new_category_code';

    -- Додавання нових позицій до цієї категорії
    INSERT INTO price_list_items (id, code, name, unit, base_price, details_price, description, sort_order, is_active, created_at, updated_at, category_id)
    VALUES
        (gen_random_uuid(), 'new_item_1', 'Назва нової послуги 1', 'шт', 500.0, NULL, 'Опис', 1, true, now(), now(), new_category_id),
        (gen_random_uuid(), 'new_item_2', 'Назва нової послуги 2', 'шт', 600.0, NULL, 'Опис', 2, true, now(), now(), new_category_id);
END $$;
```

## Альтернативний підхід

Якщо ви бажаєте оновити весь прайс-лист з JSON-файлу, можна створити PL/pgSQL функцію для парсингу JSON та імпорту даних безпосередньо з JSON-файлу, використовуючи функцію `json_populate_recordset`.

Проте для цього потрібно спочатку завантажити JSON-файл у базу даних або використовувати зовнішні засоби імпорту.