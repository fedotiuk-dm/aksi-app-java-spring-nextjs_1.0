-- Скрипт для додавання тегів для тестових клієнтів

-- Спочатку отримаємо ID створених клієнтів
WITH client_ids AS (
    SELECT id, full_name FROM clients 
    WHERE phone IN (
        '+380971234567', -- Іванов Іван Іванович
        '+380661234567', -- Петренко Марія Олексіївна
        '+380501234567', -- Коваленко Олег Петрович
        '+380931234567', -- Сидоренко Анна Василівна
        '+380951234567', -- Мельник Степан Богданович
        '+380681234567'  -- Ковальчук Наталія Ігорівна
    )
    AND deleted_at IS NULL
)

-- Додаємо теги для клієнтів
INSERT INTO client_tags (client_id, tag)
SELECT id, 'постійний клієнт' FROM client_ids WHERE full_name = 'Іванов Іван Іванович'
UNION ALL
SELECT id, 'vip' FROM client_ids WHERE full_name = 'Іванов Іван Іванович'
UNION ALL
SELECT id, 'знижка' FROM client_ids WHERE full_name = 'Іванов Іван Іванович'
UNION ALL
SELECT id, 'vip' FROM client_ids WHERE full_name = 'Петренко Марія Олексіївна'
UNION ALL
SELECT id, 'пральня' FROM client_ids WHERE full_name = 'Петренко Марія Олексіївна' 
UNION ALL
SELECT id, 'корпоративний' FROM client_ids WHERE full_name = 'Коваленко Олег Петрович'
UNION ALL
SELECT id, 'доставка' FROM client_ids WHERE full_name = 'Коваленко Олег Петрович'
UNION ALL
SELECT id, 'vip' FROM client_ids WHERE full_name = 'Сидоренко Анна Василівна'
UNION ALL
SELECT id, 'улюблений клієнт' FROM client_ids WHERE full_name = 'Сидоренко Анна Василівна'
UNION ALL
SELECT id, 'хімчистка' FROM client_ids WHERE full_name = 'Сидоренко Анна Василівна'
UNION ALL
SELECT id, 'потенційний' FROM client_ids WHERE full_name = 'Мельник Степан Богданович'
UNION ALL
SELECT id, 'повернувся' FROM client_ids WHERE full_name = 'Ковальчук Наталія Ігорівна'
UNION ALL
SELECT id, 'потребує знижку' FROM client_ids WHERE full_name = 'Ковальчук Наталія Ігорівна';

-- Перевірка додавання тегів
SELECT c.full_name, ct.tag
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
ORDER BY c.full_name, ct.tag;
