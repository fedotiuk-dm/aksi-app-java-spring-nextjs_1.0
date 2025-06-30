-- ======================================================================
-- ПРОСТІ ЧИТАБЕЛЬНІ ЗАПИТИ ДЛЯ КАТЕГОРІЙ ТА МОДИФІКАТОРІВ
-- ======================================================================
-- Після додавання читабельних колонок, ці запити стали набагато простішими
-- ======================================================================

-- 1. БАЗОВИЙ ПЕРЕГЛЯД: Категорії та їх модифікатори (з читабельними назвами)
SELECT
    category_code,
    category_name,
    modifier_code,
    modifier_name
FROM service_category_modifiers
ORDER BY category_code, modifier_code;

-- 2. СТАТИСТИКА: Скільки модифікаторів у кожної категорії
SELECT
    category_code,
    category_name,
    COUNT(*) as modifier_count
FROM service_category_modifiers
GROUP BY category_code, category_name
ORDER BY modifier_count DESC;

-- 3. ТЕКСТИЛЬНІ МОДИФІКАТОРИ (тільки для одягу, прання, прасування)
SELECT DISTINCT
    modifier_code,
    modifier_name
FROM service_category_modifiers
WHERE category_code IN ('CLOTHING', 'LAUNDRY', 'IRONING', 'DYEING')
  AND modifier_code NOT IN (
      SELECT modifier_code
      FROM service_category_modifiers
      WHERE category_code IN ('LEATHER', 'PADDING', 'FUR')
  )
ORDER BY modifier_code;

-- 4. ШКІРЯНІ МОДИФІКАТОРИ (тільки для шкіри, дублянок, хутра)
SELECT DISTINCT
    modifier_code,
    modifier_name
FROM service_category_modifiers
WHERE category_code IN ('LEATHER', 'PADDING', 'FUR')
  AND modifier_code NOT IN (
      SELECT modifier_code
      FROM service_category_modifiers
      WHERE category_code IN ('CLOTHING', 'LAUNDRY', 'IRONING', 'DYEING')
  )
ORDER BY modifier_code;

-- 5. ЗАГАЛЬНІ МОДИФІКАТОРИ (доступні для ВСІХ категорій)
WITH modifier_usage AS (
    SELECT
        modifier_code,
        modifier_name,
        COUNT(DISTINCT category_code) as category_count
    FROM service_category_modifiers
    GROUP BY modifier_code, modifier_name
),
total_categories AS (
    SELECT COUNT(DISTINCT category_code) as total
    FROM service_category_modifiers
)
SELECT
    mu.modifier_code,
    mu.modifier_name,
    mu.category_count,
    tc.total,
    CASE
        WHEN mu.category_count = tc.total THEN '✅ ЗАГАЛЬНИЙ'
        ELSE '❌ СПЕЦИФІЧНИЙ'
    END as scope
FROM modifier_usage mu, total_categories tc
ORDER BY mu.category_count DESC;

-- 6. МАТЕРІАЛИ ЗА КАТЕГОРІЯМИ
SELECT
    category_code,
    category_name,
    STRING_AGG(material_type, ', ' ORDER BY material_type) as supported_materials
FROM service_category_materials
GROUP BY category_code, category_name
ORDER BY category_code;

-- 7. КАТЕГОРІЇ З НАЙБІЛЬШОЮ КІЛЬКІСТЮ МОДИФІКАТОРІВ
SELECT
    category_code,
    category_name,
    COUNT(*) as modifier_count,
    STRING_AGG(modifier_name, ', ' ORDER BY modifier_name) as available_modifiers
FROM service_category_modifiers
GROUP BY category_code, category_name
ORDER BY modifier_count DESC;

-- 8. ШВИДКИЙ ПОШУК МОДИФІКАТОРА ЗА НАЗВОЮ
-- Замінити 'дитячі' на потрібний пошуковий термін
SELECT DISTINCT
    category_code,
    category_name,
    modifier_code,
    modifier_name
FROM service_category_modifiers
WHERE LOWER(modifier_name) LIKE LOWER('%дитячі%')
ORDER BY category_code;

-- 9. МОДИФІКАТОРИ ДЛЯ КОНКРЕТНОЇ КАТЕГОРІЇ
-- Замінити 'CLOTHING' на потрібну категорію
SELECT
    modifier_code,
    modifier_name
FROM service_category_modifiers
WHERE category_code = 'CLOTHING'
ORDER BY modifier_code;

-- 10. ЗАГАЛЬНА СТАТИСТИКА
SELECT
    'Всього категорій' as metric,
    COUNT(DISTINCT category_code) as value
FROM service_category_modifiers

UNION ALL

SELECT
    'Всього модифікаторів' as metric,
    COUNT(DISTINCT modifier_code) as value
FROM service_category_modifiers

UNION ALL

SELECT
    'Всього зв\'язків' as metric,
    COUNT(*) as value
FROM service_category_modifiers

UNION ALL

SELECT
    'Всього матеріалів' as metric,
    COUNT(DISTINCT material_type) as value
FROM service_category_materials;
