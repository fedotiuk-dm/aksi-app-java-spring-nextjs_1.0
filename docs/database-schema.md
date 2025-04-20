# Схема бази даних проєкту "Хімчистка AKSI"

## Діаграма ERD

```
+-------------------+          +--------------------+          +---------------------+
|     clients       |          |      orders        |          |     order_items     |
+-------------------+          +--------------------+          +---------------------+
| id (UUID) PK      |<-----+   | id (UUID) PK       |<-----+   | id (UUID) PK        |
| firstName         |      |   | number (unique)    |      |   | orderId (FK)        |
| lastName          |      |   | clientId (FK)      |      |   | priceListItemId(FK) |
| phone (unique)    |      |   | userId (FK)        |      |   | quantity            |
| email (unique)    |      +---| totalAmount        |      +---| name                |
| address           |          | prepaidAmount      |          | unitPrice           |
| birthdate         |          | createdAt          |          | totalPrice          |
| loyaltyLevel      |          | completedAt        |          | category            |
| gender            |          | estimatedReleaseDate|         | itemType            |
| totalSpent        |          | paymentMethod      |          | fabric              |
| loyaltyPoints     |          | notes              |          | color               |
| lastPurchaseAt    |          | status             |          | description         |
| status            |          +--------------------+          | markings            |
| source            |                   |                      | specialNotes        |
| tags              |                   |                      | createdAt           |
| nextContactAt     |                   |                      | updatedAt           |
| lastContactAt     |                   |                      +---------------------+
| allowSMS          |                   |                                |
| allowEmail        |                   |                                |
| allowCalls        |                   |                                v
| frequencyScore    |                   |                      +---------------------+
| monetaryScore     |                   |                      |       photos        |
| recencyScore      |                   |                      +---------------------+
| createdAt         |                   |                      | id (UUID) PK        |
| updatedAt         |                   |                      | url                 |
| deletedAt         |                   |                      | description         |
+-------------------+                   |                      | orderItemId (FK)    |
                                       |                      | createdAt           |
                                       |                      +---------------------+
                                       |
                                       v
+-------------------+          +--------------------+
|service_categories |          |  price_list_items  |
+-------------------+          +--------------------+
| id (UUID) PK      |<-----+   | id (UUID) PK       |
| code (unique)     |      |   | categoryId (FK)    |
| name              |      |   | jsonId             |
| description       |      |   | catalogNumber      |
| sortOrder         |      +---| name               |
| createdAt         |          | unitOfMeasure      |
| updatedAt         |          | basePrice          |
+-------------------+          | priceBlack         |
                               | priceColor         |
                               | active             |
                               | createdAt          |
                               | updatedAt          |
                               +--------------------+

+-------------------+          +--------------------+
|      users        |          |  order_history     |
+-------------------+          +--------------------+
| id (UUID) PK      |<-----+   | id (UUID) PK       |
| name (unique)     |      |   | orderId (FK)       |
| email (unique)    |      |   | status             |
| emailVerified     |      |   | comment            |
| image             |      |   | createdAt          |
| password          |      |   | createdBy          |
| role              |      +---+--------------------+
| position          |
| createdAt         |          +--------------------+
| updatedAt         |          |      payments      |
+-------------------+          +--------------------+
                               | id (UUID) PK       |
                               | amount             |
                               | method             |
                               | status             |
                               | createdAt          |
                               | clientId (FK)      |
                               | orderId (FK)       |
                               +--------------------+
```

## Основні таблиці

### Users (Користувачі)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    email_verified TIMESTAMP,
    image VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STAFF',
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check CHECK (role IN ('ADMIN', 'STAFF', 'MANAGER'))
);

CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_email ON users(email);
```

### Clients (Клієнти)

```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    address TEXT,
    birthdate DATE,
    notes TEXT,
    loyalty_level VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
    gender VARCHAR(10),
    total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    last_purchase_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    source VARCHAR(20) NOT NULL DEFAULT 'OTHER',
    tags TEXT[],
    next_contact_at TIMESTAMP,
    last_contact_at TIMESTAMP,
    allow_sms BOOLEAN NOT NULL DEFAULT TRUE,
    allow_email BOOLEAN NOT NULL DEFAULT TRUE,
    allow_calls BOOLEAN NOT NULL DEFAULT TRUE,
    frequency_score INTEGER NOT NULL DEFAULT 0,
    monetary_score INTEGER NOT NULL DEFAULT 0,
    recency_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT clients_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED')),
    CONSTRAINT clients_loyalty_level_check CHECK (loyalty_level IN ('STANDARD', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM')),
    CONSTRAINT clients_source_check CHECK (source IN ('REFERRAL', 'SOCIAL_MEDIA', 'GOOGLE', 'ADVERTISEMENT', 'OTHER'))
);

CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status_created_at ON clients(status, created_at);
CREATE INDEX idx_clients_last_purchase_at ON clients(last_purchase_at);
CREATE INDEX idx_clients_loyalty_level ON clients(loyalty_level);
CREATE INDEX idx_clients_total_spent ON clients(total_spent);
CREATE INDEX idx_clients_rfm_score ON clients(recency_score, frequency_score, monetary_score);
CREATE INDEX idx_clients_deleted_at ON clients(deleted_at);
```

### Orders (Замовлення)

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_release_date TIMESTAMP,
    payment_method VARCHAR(50),
    prepaid_amount DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    client_id UUID NOT NULL REFERENCES clients(id),
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) NOT NULL,

    CONSTRAINT orders_status_check CHECK (status IN (
        'NEW', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED', 'PENDING_PAYMENT'
    ))
);

CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status_created_at ON orders(status, created_at);
CREATE INDEX idx_orders_number ON orders(number);
```

### Order Items (Елементи замовлення)

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    price_list_item_id UUID REFERENCES price_list_items(id),
    quantity INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    item_type VARCHAR(100),
    fabric VARCHAR(100),
    color VARCHAR(100),
    description TEXT,
    markings TEXT,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_price_list_item_id ON order_items(price_list_item_id);
```

### Service Categories (Категорії послуг)

```sql
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_categories_sort_order ON service_categories(sort_order);
```

### Price List Items (Позиції прайс-листа)

```sql
CREATE TABLE price_list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES service_categories(id),
    json_id VARCHAR(50),
    catalog_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit_of_measure VARCHAR(50) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    price_black DECIMAL(10, 2),
    price_color DECIMAL(10, 2),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT price_list_items_category_json_id_unique UNIQUE (category_id, json_id),
    CONSTRAINT price_list_items_category_catalog_name_unique UNIQUE (category_id, catalog_number, name)
);

CREATE INDEX idx_price_list_items_category_id ON price_list_items(category_id);
CREATE INDEX idx_price_list_items_json_id ON price_list_items(json_id);
```

### Photos (Фотографії)

```sql
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url VARCHAR(255) NOT NULL,
    description TEXT,
    order_item_id UUID NOT NULL REFERENCES order_items(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_photos_order_item_id ON photos(order_item_id);
```

### Payments (Платежі)

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_id UUID NOT NULL REFERENCES clients(id),
    order_id UUID REFERENCES orders(id)
);

CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### Order History (Історія замовлень)

```sql
CREATE TABLE order_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);

CREATE INDEX idx_order_history_order_id ON order_history(order_id);
```

## Енумерації

### Role (Ролі користувачів)

```
ADMIN     - Адміністратор з повними правами
MANAGER   - Менеджер (керування замовленнями, клієнтами)
STAFF     - Персонал (обробка замовлень)
```

### OrderStatus (Статуси замовлень)

```
NEW             - Нове замовлення
PROCESSING      - В обробці
READY           - Готове до видачі
COMPLETED       - Завершене
CANCELLED       - Скасоване
PENDING_PAYMENT - Очікує оплати
```

### LoyaltyLevel (Рівні лояльності)

```
STANDARD  - Стандартний рівень
BRONZE    - Бронзовий рівень
SILVER    - Срібний рівень
GOLD      - Золотий рівень
PLATINUM  - Платиновий рівень
```

### ClientStatus (Статуси клієнтів)

```
ACTIVE    - Активний
INACTIVE  - Неактивний
BLOCKED   - Заблокований
```

### ClientSource (Джерела клієнтів)

```
REFERRAL      - За рекомендацією
SOCIAL_MEDIA  - Соціальні мережі
GOOGLE        - Пошук Google
ADVERTISEMENT - Реклама
OTHER         - Інше
```

## Приклади запитів

### Отримання списку замовлень клієнта з елементами

```sql
SELECT
    o.id AS order_id,
    o.number AS order_number,
    o.created_at AS order_date,
    o.status,
    o.total_amount,
    c.full_name AS client_name,
    c.phone AS client_phone,
    COUNT(oi.id) AS items_count,
    COALESCE(SUM(p.amount), 0) AS paid_amount
FROM orders o
JOIN clients c ON o.client_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN payments p ON o.id = p.order_id AND p.status = 'COMPLETED'
WHERE c.id = :client_id
GROUP BY o.id, c.full_name, c.phone
ORDER BY o.created_at DESC;
```

### Пошук клієнтів з фільтрацією за статусом та рівнем лояльності

```sql
SELECT
    c.id,
    c.full_name,
    c.phone,
    c.email,
    c.loyalty_level,
    c.total_spent,
    c.loyalty_points,
    COALESCE(COUNT(o.id), 0) AS orders_count,
    MAX(o.created_at) AS last_order_date
FROM clients c
LEFT JOIN orders o ON c.id = o.client_id
WHERE
    c.status = :status AND
    c.loyalty_level = :loyalty_level AND
    c.deleted_at IS NULL
GROUP BY c.id
ORDER BY c.full_name;
```

### Отримання детальної інформації про замовлення

```sql
SELECT
    o.id AS order_id,
    o.number AS order_number,
    o.created_at,
    o.completed_at,
    o.estimated_release_date,
    o.status,
    o.total_amount,
    o.prepaid_amount,
    o.payment_method,
    o.notes,
    c.id AS client_id,
    c.full_name AS client_name,
    c.phone AS client_phone,
    c.email AS client_email,
    u.id AS user_id,
    u.name AS user_name,
    oi.id AS item_id,
    oi.name AS item_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    oi.item_type,
    oi.fabric,
    oi.color,
    oi.description,
    oi.special_notes,
    pli.id AS price_list_item_id,
    pli.name AS price_list_item_name,
    sc.name AS category_name,
    sc.code AS category_code,
    p.url AS photo_url
FROM orders o
JOIN clients c ON o.client_id = c.id
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN price_list_items pli ON oi.price_list_item_id = pli.id
LEFT JOIN service_categories sc ON pli.category_id = sc.id
LEFT JOIN photos p ON oi.id = p.order_item_id
WHERE o.id = :order_id
ORDER BY oi.created_at, p.created_at;
```
