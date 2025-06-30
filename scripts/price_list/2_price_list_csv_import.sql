-- Створюємо тимчасову таблицю для імпорту
CREATE TEMPORARY TABLE temp_price_list (
    category_code VARCHAR(255),
    catalog_number INT,
    name VARCHAR(255),
    unit_of_measure VARCHAR(50),
    base_price DECIMAL(10, 2),
    price_black DECIMAL(10, 2),
    price_color DECIMAL(10, 2),
    active BOOLEAN
);

-- Копіюємо дані з CSV файлу
COPY temp_price_list FROM '/price_list.csv' DELIMITER ',' CSV HEADER;

-- Вставляємо дані з тимчасової таблиці у основну (UUID генерується автоматично)
INSERT INTO price_list_items (category_id, catalog_number, name, unit_of_measure, base_price, price_black, price_color, active)
SELECT
    sc.id,
    tpl.catalog_number,
    tpl.name,
    tpl.unit_of_measure,
    tpl.base_price,
    tpl.price_black,
    tpl.price_color,
    tpl.active
FROM
    temp_price_list tpl
JOIN
    service_categories sc ON tpl.category_code = sc.code
WHERE
    NOT EXISTS (
        SELECT 1
        FROM price_list_items pli
        WHERE pli.category_id = sc.id AND pli.catalog_number = tpl.catalog_number AND pli.name = tpl.name
    );

-- Робимо всі існуючі позиції активними
UPDATE price_list_items SET active = TRUE;
