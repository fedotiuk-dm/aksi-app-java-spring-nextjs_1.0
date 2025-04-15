-- Створення розширення для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Створення таблиці clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    additional_phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(500),
    notes TEXT,
    source VARCHAR(100),
    birth_date DATE,
    last_order_date TIMESTAMP,
    total_spent DOUBLE PRECISION,
    order_count INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    loyalty_points INTEGER DEFAULT 0,
    loyalty_level VARCHAR(20) DEFAULT 'STANDARD',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Таблиця для тегів клієнта
CREATE TABLE IF NOT EXISTS client_tags (
    client_id UUID NOT NULL REFERENCES clients(id),
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (client_id, tag)
);

-- Індекс для пошуку за тегами
CREATE INDEX IF NOT EXISTS idx_client_tags ON client_tags(client_id, tag); 