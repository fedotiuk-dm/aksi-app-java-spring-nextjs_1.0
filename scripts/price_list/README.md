# Посібник з імпорту прайс-листа в PostgreSQL

Цей посібник описує процес імпорту даних прайс-листа з CSV-файлу в базу даних PostgreSQL.

## Передумови

1. Запущені Docker-контейнери з PostgreSQL та pgAdmin
2. Доступ до pgAdmin через http://localhost:5050
3. Підготовлений CSV-файл з даними прайс-листа

## Структура CSV-файлу

CSV-файл повинен мати наступну структуру (включно з заголовками):

```
category_code,catalog_number,name,unit_of_measure,base_price,price_black,price_color,active
odiah,1,Брюки,шт,380.00,,,true
```

Де:

- category_code - код категорії, що відповідає полю code в таблиці service_categories
- catalog_number - порядковий номер в каталозі
- name - назва послуги
- unit_of_measure - одиниця виміру
- base_price - базова ціна
- price_black - ціна для чорних речей (може бути порожнім)
- price_color - ціна для кольорових речей (може бути порожнім)
- active - активність послуги (true/false)

## Кроки для імпорту

### 1. Копіювання CSV-файлу в контейнер PostgreSQL

```bash
docker cp /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/scripts/price_list/price_list.csv postgres:/price_list.csv
```

### DEV

```bash
docker cp /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/scripts/price_list/price_list.csv postgres-dev:/price_list.csv
```

### 2. Виконання SQL-скрипта імпорту через pgAdmin

1. Відкрийте pgAdmin у браузері: http://localhost:5050
2. Увійдіть з вашими обліковими даними
3. Підключіться до серверу PostgreSQL
4. Відкрийте Query Tool (натисніть правою кнопкою на вашу базу даних і виберіть "Query Tool")
5. Відкрийте файл SQL-скрипту або скопіюйте його вміст у редактор запитів
6. Переконайтеся, що в скрипті вказано правильний шлях до CSV-файлу в контейнері:
   ```sql
   COPY temp_price_list FROM '/price_list.csv' DELIMITER ',' CSV HEADER;
   ```
7. Натисніть кнопку Execute (F5)

### 3. Альтернативний спосіб через командний рядок

```bash
docker exec -i postgres psql -U postgres -d postgres -f - < /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/scripts/price_list_csv_import.sql
```

### 4. Перевірка результатів імпорту

Виконайте наступний запит для перевірки кількості імпортованих позицій:

```sql
SELECT sc.name AS category_name, COUNT(pli.id) AS items_count
FROM service_categories sc
LEFT JOIN price_list_items pli ON pli.category_id = sc.id
GROUP BY sc.name
ORDER BY sc.sort_order;
```

## Оновлення існуючих позицій

Якщо потрібно оновити існуючі позиції прайс-листа, додайте в SQL-скрипт умову ON CONFLICT для оновлення існуючих записів.

## Створення нового CSV з JSON

Якщо у вас є новий прайс-лист у форматі JSON, ви можете використати скрипт `json-to-csv-converter.js` з директорії `test/V2price/` для конвертації JSON у CSV перед імпортом.
