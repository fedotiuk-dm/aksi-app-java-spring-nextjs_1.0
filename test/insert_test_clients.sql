-- Скрипт для додавання тестових клієнтів на основі реальної структури бази даних

-- Додавання тестових клієнтів
INSERT INTO clients 
(
    id, 
    full_name, 
    phone, 
    additional_phone, 
    email, 
    address, 
    notes, 
    source, 
    birth_date, 
    last_order_date,
    total_spent,
    order_count,
    status, 
    loyalty_points,
    loyalty_level,
    gender,
    allow_sms,
    allow_email,
    allow_calls,
    next_contact_at,
    last_contact_at,
    frequency_score,
    monetary_score,
    recency_score,
    deleted_at,
    created_at, 
    updated_at
) VALUES 
-- Клієнт 1
(
    gen_random_uuid(), -- id
    'Іванов Іван Іванович', -- full_name
    '+380971234567', -- phone
    '+380991234567', -- additional_phone
    'ivan@example.com', -- email
    'вул. Шевченка, 10, кв. 5', -- address
    'Постійний клієнт', -- notes
    'REFERRAL', -- source (використовуємо правильний enum з реальної БД)
    '1985-05-15', -- birth_date
    CURRENT_TIMESTAMP - INTERVAL '10 days', -- last_order_date
    5000.50, -- total_spent
    3, -- order_count
    'ACTIVE', -- status
    150, -- loyalty_points
    'STANDARD', -- loyalty_level
    'MALE', -- gender
    true, -- allow_sms
    true, -- allow_email
    true, -- allow_calls
    CURRENT_TIMESTAMP + INTERVAL '30 days', -- next_contact_at
    CURRENT_TIMESTAMP - INTERVAL '5 days', -- last_contact_at
    3, -- frequency_score
    4, -- monetary_score
    3, -- recency_score
    NULL, -- deleted_at
    CURRENT_TIMESTAMP, -- created_at
    CURRENT_TIMESTAMP -- updated_at
),
-- Клієнт 2
(
    gen_random_uuid(), -- id
    'Петренко Марія Олексіївна', -- full_name
    '+380661234567', -- phone
    NULL, -- additional_phone
    'maria@example.com', -- email
    'вул. Лесі Українки, 25, кв. 12', -- address
    NULL, -- notes
    'SOCIAL_MEDIA', -- source
    '1990-08-22', -- birth_date
    CURRENT_TIMESTAMP - INTERVAL '2 days', -- last_order_date
    15000.75, -- total_spent
    10, -- order_count
    'ACTIVE', -- status
    450, -- loyalty_points
    'GOLD', -- loyalty_level
    'FEMALE', -- gender
    true, -- allow_sms
    true, -- allow_email
    false, -- allow_calls
    CURRENT_TIMESTAMP + INTERVAL '14 days', -- next_contact_at
    CURRENT_TIMESTAMP - INTERVAL '2 days', -- last_contact_at
    5, -- frequency_score
    5, -- frequency_score
    4, -- monetary_score
    NULL, -- deleted_at
    CURRENT_TIMESTAMP, -- created_at
    CURRENT_TIMESTAMP -- updated_at
),
-- Клієнт 3
(
    gen_random_uuid(), -- id
    'Коваленко Олег Петрович', -- full_name
    '+380501234567', -- phone
    NULL, -- additional_phone
    NULL, -- email
    'вул. Франка, 15', -- address
    'Надає перевагу доставці', -- notes
    'GOOGLE', -- source
    NULL, -- birth_date
    CURRENT_TIMESTAMP - INTERVAL '30 days', -- last_order_date
    8500.25, -- total_spent
    5, -- order_count
    'ACTIVE', -- status
    200, -- loyalty_points
    'SILVER', -- loyalty_level
    'MALE', -- gender
    true, -- allow_sms
    false, -- allow_email
    true, -- allow_calls
    NULL, -- next_contact_at
    CURRENT_TIMESTAMP - INTERVAL '30 days', -- last_contact_at
    2, -- frequency_score
    3, -- monetary_score
    3, -- recency_score
    NULL, -- deleted_at
    CURRENT_TIMESTAMP, -- created_at
    CURRENT_TIMESTAMP -- updated_at
),
-- Клієнт 4
(
    gen_random_uuid(), -- id
    'Сидоренко Анна Василівна', -- full_name
    '+380931234567', -- phone
    '+380671234567', -- additional_phone
    'anna@example.com', -- email
    'пр. Перемоги, 50, кв. 78', -- address
    'Любить каву', -- notes
    'ADVERTISEMENT', -- source
    '1988-12-10', -- birth_date
    CURRENT_TIMESTAMP - INTERVAL '1 day', -- last_order_date
    30000.00, -- total_spent
    25, -- order_count
    'ACTIVE', -- status
    1200, -- loyalty_points
    'PLATINUM', -- loyalty_level
    'FEMALE', -- gender
    true, -- allow_sms
    true, -- allow_email
    true, -- allow_calls
    CURRENT_TIMESTAMP + INTERVAL '7 days', -- next_contact_at
    CURRENT_TIMESTAMP - INTERVAL '1 day', -- last_contact_at
    5, -- frequency_score
    5, -- frequency_score
    5, -- monetary_score
    NULL, -- deleted_at
    CURRENT_TIMESTAMP, -- created_at
    CURRENT_TIMESTAMP -- updated_at
),
-- Клієнт 5
(
    gen_random_uuid(), -- id
    'Мельник Степан Богданович', -- full_name
    '+380951234567', -- phone
    NULL, -- additional_phone
    'stepan@example.com', -- email
    'вул. Сагайдачного, 35, кв. 3', -- address
    NULL, -- notes
    'WALK_IN', -- source (додаткове значення з реальних enum)
    '1975-03-20', -- birth_date
    CURRENT_TIMESTAMP - INTERVAL '120 days', -- last_order_date
    1200.00, -- total_spent
    1, -- order_count
    'INACTIVE', -- status
    10, -- loyalty_points
    'STANDARD', -- loyalty_level
    'MALE', -- gender
    false, -- allow_sms
    true, -- allow_email
    false, -- allow_calls
    NULL, -- next_contact_at
    CURRENT_TIMESTAMP - INTERVAL '120 days', -- last_contact_at
    1, -- frequency_score
    1, -- frequency_score
    2, -- monetary_score
    NULL, -- deleted_at
    CURRENT_TIMESTAMP, -- created_at
    CURRENT_TIMESTAMP -- updated_at
),
-- Клієнт 6 (додатковий, з джерелом RETURNING)
(
    gen_random_uuid(), -- id
    'Ковальчук Наталія Ігорівна', -- full_name
    '+380681234567', -- phone
    NULL, -- additional_phone
    'natalia@example.com', -- email
    'вул. Володимирська, 42, кв. 15', -- address
    'Постійний клієнт, повернулася після перерви', -- notes
    'RETURNING', -- source (додаткове значення з реальних enum)
    '1980-07-10', -- birth_date
    CURRENT_TIMESTAMP - INTERVAL '5 days', -- last_order_date
    7500.00, -- total_spent
    8, -- order_count
    'ACTIVE', -- status
    300, -- loyalty_points
    'SILVER', -- loyalty_level
    'FEMALE', -- gender
    true, -- allow_sms
    true, -- allow_email
    true, -- allow_calls
    CURRENT_TIMESTAMP + INTERVAL '20 days', -- next_contact_at
    CURRENT_TIMESTAMP - INTERVAL '5 days', -- last_contact_at
    4, -- frequency_score
    3, -- frequency_score
    4, -- monetary_score
    NULL, -- deleted_at
    CURRENT_TIMESTAMP, -- created_at
    CURRENT_TIMESTAMP -- updated_at
);
