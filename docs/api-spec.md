# API Специфікація проєкту "Хімчистка AKSI"

## Базовий URL

```
http://localhost:8080/api
```

## Формат відповіді

Усі відповіді на запити мають стандартний формат:

```json
{
  "success": true,
  "data": {}, // Дані відповіді
  "message": "Операція успішна",
  "timestamp": "2023-10-10T12:00:00Z"
}
```

У випадку помилки:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Опис помилки"
  },
  "timestamp": "2023-10-10T12:00:00Z"
}
```

## Автентифікація

### Login

```
POST /auth/login
```

**Запит:**

```json
{
  "email": "admin@aksi.com",
  "password": "password123"
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "admin",
      "email": "admin@aksi.com",
      "role": "ADMIN",
      "position": "Головний адміністратор"
    }
  },
  "message": "Вхід успішний",
  "timestamp": "2023-10-10T12:00:00Z"
}
```

### Реєстрація

```
POST /auth/register
```

**Запит:**

```json
{
  "name": "newuser",
  "password": "password123",
  "email": "newuser@aksi.com",
  "position": "Менеджер"
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "newuser",
    "email": "newuser@aksi.com",
    "role": "STAFF",
    "position": "Менеджер"
  },
  "message": "Користувач зареєстрований",
  "timestamp": "2023-10-10T12:05:00Z"
}
```

## Клієнти

### Отримання списку клієнтів

```
GET /clients?page=0&size=10&sort=fullName,asc&status=ACTIVE
```

**Параметри:**

- `page`: номер сторінки (за замовчуванням 0)
- `size`: кількість елементів на сторінці (за замовчуванням 10)
- `sort`: поле та напрямок сортування (за замовчуванням id,asc)
- `status`: фільтр за статусом (опціонально)
- `loyaltyLevel`: фільтр за рівнем лояльності (опціонально)

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "fullName": "Андрій Петренко",
        "phone": "+380501234567",
        "email": "andriy@example.com",
        "address": "м. Київ, вул. Хрещатик, 1",
        "status": "ACTIVE",
        "loyaltyLevel": "GOLD",
        "totalSpent": 15800.5,
        "loyaltyPoints": 580,
        "lastPurchaseAt": "2023-09-20T14:20:00Z"
      }
      // ...інші клієнти
    ],
    "totalElements": 100,
    "totalPages": 10,
    "page": 0,
    "size": 10
  },
  "timestamp": "2023-10-10T12:10:00Z"
}
```

### Пошук клієнтів

```
GET /clients/search?query=Петр&page=0&size=10
```

**Параметри:**

- `query`: пошуковий запит (повне ім'я, телефон або email)
- `page`, `size`: параметри пагінації

**Відповідь:** (аналогічна формату отримання списку клієнтів)

### Отримання клієнта за ID

```
GET /clients/{id}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "fullName": "Андрій Петренко",
    "phone": "+380501234567",
    "email": "andriy@example.com",
    "address": "м. Київ, вул. Хрещатик, 1",
    "birthdate": "1985-07-12",
    "notes": "Постійний клієнт",
    "loyaltyLevel": "GOLD",
    "gender": "MALE",
    "totalSpent": 15800.5,
    "loyaltyPoints": 580,
    "lastPurchaseAt": "2023-09-20T14:20:00Z",
    "status": "ACTIVE",
    "source": "REFERRAL",
    "tags": ["vip", "постійний"],
    "nextContactAt": null,
    "lastContactAt": "2023-09-20T14:20:00Z",
    "allowSMS": true,
    "allowEmail": true,
    "allowCalls": true,
    "frequencyScore": 8,
    "monetaryScore": 9,
    "recencyScore": 10,
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-09-20T14:20:00Z"
  },
  "timestamp": "2023-10-10T12:15:00Z"
}
```

### Створення нового клієнта

```
POST /clients
```

**Запит:**

```json
{
  "fullName": "Марія Іваненко",
  "phone": "+380671234567",
  "email": "maria@example.com",
  "address": "м. Львів, пл. Ринок, 10",
  "birthdate": "1990-03-15",
  "gender": "FEMALE",
  "source": "SOCIAL_MEDIA",
  "tags": ["новий"],
  "allowSMS": true,
  "allowEmail": true,
  "allowCalls": false
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "fullName": "Марія Іваненко",
    "phone": "+380671234567",
    "email": "maria@example.com",
    "status": "ACTIVE",
    "loyaltyLevel": "STANDARD",
    "createdAt": "2023-10-10T12:20:00Z"
  },
  "message": "Клієнт успішно створений",
  "timestamp": "2023-10-10T12:20:00Z"
}
```

### Оновлення клієнта

```
PUT /clients/{id}
```

**Запит:**

```json
{
  "fullName": "Марія Іваненко-Петренко",
  "phone": "+380671234567",
  "email": "maria.new@example.com",
  "address": "м. Львів, пл. Ринок, 10, кв. 5",
  "tags": ["новий", "vip"]
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "fullName": "Марія Іваненко-Петренко",
    "phone": "+380671234567",
    "email": "maria.new@example.com",
    "updatedAt": "2023-10-10T12:25:00Z"
  },
  "message": "Клієнт успішно оновлений",
  "timestamp": "2023-10-10T12:25:00Z"
}
```

### Видалення клієнта

```
DELETE /clients/{id}
```

**Відповідь:**

```json
{
  "success": true,
  "message": "Клієнт успішно видалений",
  "timestamp": "2023-10-10T12:30:00Z"
}
```

## Замовлення

### Отримання списку замовлень

```
GET /orders?page=0&size=10&sort=createdAt,desc&status=PROCESSING
```

**Параметри:**

- `page`: номер сторінки (за замовчуванням 0)
- `size`: кількість елементів на сторінці (за замовчуванням 10)
- `sort`: поле та напрямок сортування (за замовчуванням createdAt,desc)
- `status`: фільтр за статусом (опціонально)
- `clientId`: фільтр за ID клієнта (опціонально)

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174004",
        "number": "ORD-2023-0001",
        "clientId": "123e4567-e89b-12d3-a456-426614174002",
        "clientName": "Андрій Петренко",
        "status": "PROCESSING",
        "totalAmount": 1250.0,
        "prepaidAmount": 500.0,
        "createdAt": "2023-10-08T15:30:00Z",
        "estimatedReleaseDate": "2023-10-12T18:00:00Z",
        "itemsCount": 3
      }
      // ...інші замовлення
    ],
    "totalElements": 45,
    "totalPages": 5,
    "page": 0,
    "size": 10
  },
  "timestamp": "2023-10-10T12:35:00Z"
}
```

### Отримання замовлення за ID

```
GET /orders/{id}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "number": "ORD-2023-0001",
    "status": "PROCESSING",
    "totalAmount": 1250.0,
    "prepaidAmount": 500.0,
    "paymentMethod": "CARD",
    "createdAt": "2023-10-08T15:30:00Z",
    "completedAt": null,
    "estimatedReleaseDate": "2023-10-12T18:00:00Z",
    "notes": "Терміново",
    "client": {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "fullName": "Андрій Петренко",
      "phone": "+380501234567",
      "email": "andriy@example.com"
    },
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "admin"
    },
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174005",
        "name": "Пальто",
        "quantity": 1,
        "unitPrice": 800.0,
        "totalPrice": 800.0,
        "category": "Верхній одяг",
        "itemType": "Пальто",
        "fabric": "Вовна",
        "color": "Чорний",
        "description": "Пальто чоловіче класичне",
        "photos": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174008",
            "url": "https://storage.aksi.com/photos/123.jpg",
            "description": "Загальний вигляд"
          }
        ],
        "priceListItem": {
          "id": "123e4567-e89b-12d3-a456-426614174009",
          "name": "Пальто хімчистка",
          "catalogNumber": 101
        }
      },
      {
        "id": "123e4567-e89b-12d3-a456-426614174006",
        "name": "Сорочка",
        "quantity": 2,
        "unitPrice": 225.0,
        "totalPrice": 450.0,
        "category": "Сорочки",
        "itemType": "Сорочка",
        "fabric": "Бавовна",
        "color": "Білий",
        "description": "Сорочки офісні",
        "photos": []
      }
    ],
    "history": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174007",
        "status": "NEW",
        "comment": "Замовлення створене",
        "createdAt": "2023-10-08T15:30:00Z",
        "createdBy": "123e4567-e89b-12d3-a456-426614174000"
      },
      {
        "id": "123e4567-e89b-12d3-a456-426614174010",
        "status": "PROCESSING",
        "comment": "Передано в обробку",
        "createdAt": "2023-10-08T16:45:00Z",
        "createdBy": "123e4567-e89b-12d3-a456-426614174000"
      }
    ],
    "payments": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174011",
        "amount": 500.0,
        "method": "CARD",
        "status": "COMPLETED",
        "createdAt": "2023-10-08T15:35:00Z"
      }
    ]
  },
  "timestamp": "2023-10-10T12:40:00Z"
}
```

### Створення нового замовлення

```
POST /orders
```

**Запит:**

```json
{
  "clientId": "123e4567-e89b-12d3-a456-426614174002",
  "estimatedReleaseDate": "2023-10-15T18:00:00Z",
  "paymentMethod": "CASH",
  "prepaidAmount": 0,
  "notes": "Клієнт забере самостійно",
  "items": [
    {
      "priceListItemId": "123e4567-e89b-12d3-a456-426614174009",
      "quantity": 1,
      "name": "Пальто",
      "unitPrice": 800.0,
      "totalPrice": 800.0,
      "category": "Верхній одяг",
      "itemType": "Пальто",
      "fabric": "Вовна",
      "color": "Сірий",
      "description": "Пальто жіноче класичне",
      "specialNotes": "Делікатне прання"
    },
    {
      "priceListItemId": "123e4567-e89b-12d3-a456-426614174012",
      "quantity": 3,
      "name": "Сорочка",
      "unitPrice": 225.0,
      "totalPrice": 675.0,
      "category": "Сорочки",
      "itemType": "Сорочка",
      "fabric": "Бавовна",
      "color": "Різні кольори"
    }
  ]
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174013",
    "number": "ORD-2023-0002",
    "status": "NEW",
    "totalAmount": 1475.0,
    "createdAt": "2023-10-10T12:45:00Z"
  },
  "message": "Замовлення успішно створене",
  "timestamp": "2023-10-10T12:45:00Z"
}
```

### Оновлення статусу замовлення

```
PATCH /orders/{id}/status
```

**Запит:**

```json
{
  "status": "READY",
  "comment": "Замовлення готове до видачі"
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174013",
    "status": "READY",
    "updatedAt": "2023-10-10T12:50:00Z"
  },
  "message": "Статус замовлення успішно оновлений",
  "timestamp": "2023-10-10T12:50:00Z"
}
```

## Прайс-лист

### Отримання категорій послуг

```
GET /service-categories
```

**Відповідь:**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174014",
      "code": "outerwear",
      "name": "Верхній одяг",
      "description": "Куртки, пальта, плащі",
      "sortOrder": 1
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174015",
      "code": "dresses",
      "name": "Сукні",
      "description": "Усі види суконь",
      "sortOrder": 2
    }
    // ...інші категорії
  ],
  "timestamp": "2023-10-10T12:55:00Z"
}
```

### Отримання позицій прайс-листа за категорією

```
GET /price-list-items?categoryId=123e4567-e89b-12d3-a456-426614174014
```

**Параметри:**

- `categoryId`: ID категорії послуг (опціонально)
- `active`: фільтр за активністю (true/false, опціонально)

**Відповідь:**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174009",
      "categoryId": "123e4567-e89b-12d3-a456-426614174014",
      "catalogNumber": 101,
      "name": "Пальто хімчистка",
      "unitOfMeasure": "шт",
      "basePrice": 800.0,
      "priceBlack": 850.0,
      "priceColor": 900.0,
      "active": true
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174016",
      "categoryId": "123e4567-e89b-12d3-a456-426614174014",
      "catalogNumber": 102,
      "name": "Куртка хімчистка",
      "unitOfMeasure": "шт",
      "basePrice": 750.0,
      "priceBlack": null,
      "priceColor": 850.0,
      "active": true
    }
    // ...інші позиції
  ],
  "timestamp": "2023-10-10T13:00:00Z"
}
```

### Додавання нової позиції прайс-листа

```
POST /price-list-items
```

**Запит:**

```json
{
  "categoryId": "123e4567-e89b-12d3-a456-426614174014",
  "catalogNumber": 103,
  "name": "Плащ хімчистка",
  "unitOfMeasure": "шт",
  "basePrice": 700.0,
  "priceBlack": 750.0,
  "priceColor": 800.0,
  "active": true
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174017",
    "catalogNumber": 103,
    "name": "Плащ хімчистка",
    "active": true
  },
  "message": "Позицію прайс-листа успішно додано",
  "timestamp": "2023-10-10T13:05:00Z"
}
```

## Платежі

### Отримання платежів за замовленням

```
GET /payments?orderId=123e4567-e89b-12d3-a456-426614174004
```

**Параметри:**

- `orderId`: ID замовлення (опціонально)
- `clientId`: ID клієнта (опціонально)
- `status`: статус платежу (опціонально)

**Відповідь:**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174011",
      "orderId": "123e4567-e89b-12d3-a456-426614174004",
      "clientId": "123e4567-e89b-12d3-a456-426614174002",
      "amount": 500.0,
      "method": "CARD",
      "status": "COMPLETED",
      "createdAt": "2023-10-08T15:35:00Z"
    }
  ],
  "timestamp": "2023-10-10T13:10:00Z"
}
```

### Створення нового платежу

```
POST /payments
```

**Запит:**

```json
{
  "orderId": "123e4567-e89b-12d3-a456-426614174004",
  "clientId": "123e4567-e89b-12d3-a456-426614174002",
  "amount": 750.0,
  "method": "CASH",
  "status": "COMPLETED"
}
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174018",
    "amount": 750.0,
    "method": "CASH",
    "status": "COMPLETED",
    "createdAt": "2023-10-10T13:15:00Z"
  },
  "message": "Платіж успішно створено",
  "timestamp": "2023-10-10T13:15:00Z"
}
```

## Аналітика

### Отримання статистики замовлень

```
GET /analytics/orders?startDate=2023-09-01&endDate=2023-10-10
```

**Параметри:**

- `startDate`: початкова дата (обов'язково)
- `endDate`: кінцева дата (обов'язково)
- `groupBy`: групування (day, week, month, year; за замовчуванням day)

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "ordersCount": 58,
    "totalAmount": 78500.5,
    "averageOrderValue": 1353.46,
    "byPeriod": [
      {
        "period": "2023-09",
        "ordersCount": 45,
        "totalAmount": 60200.0
      },
      {
        "period": "2023-10",
        "ordersCount": 13,
        "totalAmount": 18300.5
      }
    ],
    "byStatus": [
      {
        "status": "COMPLETED",
        "ordersCount": 42,
        "totalAmount": 55800.5
      },
      {
        "status": "PROCESSING",
        "ordersCount": 10,
        "totalAmount": 15400.0
      },
      {
        "status": "NEW",
        "ordersCount": 6,
        "totalAmount": 7300.0
      }
    ]
  },
  "timestamp": "2023-10-10T13:20:00Z"
}
```

### Отримання статистики клієнтів

```
GET /analytics/clients
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "totalClients": 210,
    "activeClients": 185,
    "newClientsLast30Days": 12,
    "byLoyaltyLevel": [
      {
        "level": "STANDARD",
        "count": 120,
        "percentage": 57.14
      },
      {
        "level": "BRONZE",
        "count": 45,
        "percentage": 21.43
      },
      {
        "level": "SILVER",
        "count": 30,
        "percentage": 14.29
      },
      {
        "level": "GOLD",
        "count": 12,
        "percentage": 5.71
      },
      {
        "level": "PLATINUM",
        "count": 3,
        "percentage": 1.43
      }
    ],
    "bySource": [
      {
        "source": "REFERRAL",
        "count": 85,
        "percentage": 40.48
      },
      {
        "source": "GOOGLE",
        "count": 65,
        "percentage": 30.95
      },
      {
        "source": "SOCIAL_MEDIA",
        "count": 35,
        "percentage": 16.67
      },
      {
        "source": "ADVERTISEMENT",
        "count": 15,
        "percentage": 7.14
      },
      {
        "source": "OTHER",
        "count": 10,
        "percentage": 4.76
      }
    ]
  },
  "timestamp": "2023-10-10T13:25:00Z"
}
```
