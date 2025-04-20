-- Скрипт для додавання тегів для тестових клієнтів

-- Спочатку отримаємо ID створених клієнтів
WITH client_ids AS (
    SELECT id, last_name, first_name FROM clients 
    WHERE phone IN (
        '+380971234567', -- Іванов Іван
        '+380661234567', -- Петренко Марія
        '+380501234567', -- Коваленко Олег
        '+380931234567', -- Сидоренко Анна
        '+380951234567', -- Мельник Степан
        '+380681234567'  -- Ковальчук Наталія
    )
    AND deleted_at IS NULL
)

-- Додаємо теги для клієнтів
INSERT INTO client_tags (client_id, tag)
SELECT id, 'постійний клієнт' FROM client_ids WHERE last_name = 'Іванов' AND first_name = 'Іван'
UNION ALL
SELECT id, 'vip' FROM client_ids WHERE last_name = 'Іванов' AND first_name = 'Іван'
UNION ALL
SELECT id, 'знижка' FROM client_ids WHERE last_name = 'Іванов' AND first_name = 'Іван'
UNION ALL
SELECT id, 'vip' FROM client_ids WHERE last_name = 'Петренко' AND first_name = 'Марія'
UNION ALL
SELECT id, 'пральня' FROM client_ids WHERE last_name = 'Петренко' AND first_name = 'Марія' 
UNION ALL
SELECT id, 'корпоративний' FROM client_ids WHERE last_name = 'Коваленко' AND first_name = 'Олег'
UNION ALL
SELECT id, 'доставка' FROM client_ids WHERE last_name = 'Коваленко' AND first_name = 'Олег'
UNION ALL
SELECT id, 'vip' FROM client_ids WHERE last_name = 'Сидоренко' AND first_name = 'Анна'
UNION ALL
SELECT id, 'улюблений клієнт' FROM client_ids WHERE last_name = 'Сидоренко' AND first_name = 'Анна'
UNION ALL
SELECT id, 'хімчистка' FROM client_ids WHERE last_name = 'Сидоренко' AND first_name = 'Анна'
UNION ALL
SELECT id, 'потенційний' FROM client_ids WHERE last_name = 'Мельник' AND first_name = 'Степан'
UNION ALL
SELECT id, 'повернувся' FROM client_ids WHERE last_name = 'Ковальчук' AND first_name = 'Наталія'
UNION ALL
SELECT id, 'потребує знижку' FROM client_ids WHERE last_name = 'Ковальчук' AND first_name = 'Наталія';

-- Перевірка додавання тегів
SELECT CONCAT(c.last_name, ' ', c.first_name) AS full_name, ct.tag
FROM clients c
JOIN client_tags ct ON c.id = ct.client_id
WHERE c.phone IN (
    '+380971234567', 
    '+380661234567', 
    '+380501234567', 
    '+380931234567', 
    '+380951234567',
    '+380681234567'
)
ORDER BY c.last_name, c.first_name, ct.tag;
