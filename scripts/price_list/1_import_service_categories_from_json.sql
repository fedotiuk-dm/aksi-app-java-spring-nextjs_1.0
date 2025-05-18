-- Скрипт для імпорту категорій сервісів з JSON файлу в PostgreSQL
-- Створено на основі даних з /test/V2price/price_list.json

-- Очищення таблиці перед імпортом (опціонально)
-- TRUNCATE service_categories CASCADE;

-- Імпорт категорій сервісів
INSERT INTO service_categories (id, code, name, description, sort_order, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'CLOTHING', 'Чистка одягу та текстилю', 'Категорія послуг для чистки різноманітного одягу та текстильних виробів', 1, now(), now()),
    (gen_random_uuid(), 'LAUNDRY', 'Прання білизни', 'Послуги прання різних видів білизни', 2, now(), now()),
    (gen_random_uuid(), 'IRONING', 'Прасування', 'Послуги прасування різних видів одягу та білизни', 3, now(), now()),
    (gen_random_uuid(), 'LEATHER', 'Чистка та відновлення шкіряних виробів', 'Спеціалізовані послуги для шкіряних виробів', 4, now(), now()),
    (gen_random_uuid(), 'PADDING', 'Дублянки', 'Послуги чистки та відновлення дублянок', 5, now(), now()),
    (gen_random_uuid(), 'FUR', 'Вироби із натурального хутра', 'Послуги з обробки та чистки хутряних виробів', 6, now(), now()),
    (gen_random_uuid(), 'DYEING', 'Фарбування текстильних виробів', 'Послуги фарбування різних текстильних матеріалів', 7, now(), now()),
    (gen_random_uuid(), 'ADDITIONAL_SERVICES', 'Додаткові послуги', 'Інші супутні послуги хімчистки', 8, now(), now())
ON CONFLICT (code) DO NOTHING;

-- Перевірка імпорту
SELECT * FROM service_categories ORDER BY sort_order;
