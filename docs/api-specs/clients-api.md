# API документація для роботи з клієнтами

## Загальна інформація

Ця документація містить детальний опис API для роботи з клієнтами. Усі ендпоінти представлені з прикладами запитів та відповідей.

### Базові URL

Сервер доступний за наступними базовими URL:
- `http://localhost:8080`
- `https://aksi-app.com` (production)

### Аутентифікація

Для доступу до API клієнтів необхідно передавати JWT токен у заголовку:

```
Authorization: Bearer {your_jwt_token}
```

## Управління клієнтами

### Пошук клієнтів

**Ендпоінт:** `POST /v1/clients/search`

**Права доступу:** ADMIN, MANAGER, STAFF

**Опис:** Повертає список клієнтів з пагінацією, сортуванням та фільтрацією

**Запит:**
```json
{
  "page": 0,
  "size": 10,
  "sortField": "fullName",
  "sortDirection": "ASC",
  "filterCriteria": [
    {
      "field": "status",
      "operator": "EQUALS",
      "value": "ACTIVE"
    },
    {
      "field": "loyaltyLevel",
      "operator": "IN",
      "value": ["GOLD", "PLATINUM"]
    }
  ],
  "searchTerm": "Петр"
}
```

**Відповідь:**
```json
{
  "content": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "fullName": "Петро Іванов",
      "phone": "+380501234567",
      "email": "petro@example.com",
      "address": "м. Київ, вул. Хрещатик, 1",
      "status": "ACTIVE",
      "loyaltyLevel": "GOLD",
      "totalSpent": 15800.5,
      "loyaltyPoints": 580,
      "lastPurchaseAt": "2023-09-20T14:20:00Z"
    },
    // ... інші клієнти
  ],
  "totalElements": 35,
  "totalPages": 4,
  "number": 0,
  "size": 10
}
```

### Отримання клієнта за ID

**Ендпоінт:** `GET /v1/clients/{id}`

**Права доступу:** ADMIN, MANAGER, STAFF

**Опис:** Повертає клієнта за ідентифікатором

**Параметри шляху:**
- `id` - UUID ідентифікатор клієнта

**Відповідь:**
```json
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
  "lastPurchaseAt": "2023-09-20T14:20:00Z",
  "notes": "Постійний клієнт"
  // ... інші поля
}
```

### Створення клієнта

**Ендпоінт:** `POST /v1/clients`

**Права доступу:** ADMIN, MANAGER, STAFF

**Опис:** Створює нового клієнта з переданими даними

**Запит:**
```json
{
  "fullName": "Ірина Коваленко",
  "phone": "+380671234567",
  "email": "iryna@example.com",
  "address": "м. Львів, вул. Франка, 15",
  "birthdate": "1990-05-15",
  "gender": "FEMALE",
  "source": "WEBSITE",
  "notes": "Цікавиться послугами чистки пальто",
  "tags": ["новий", "онлайн"]
}
```

**Відповідь:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "fullName": "Ірина Коваленко",
  "phone": "+380671234567",
  "email": "iryna@example.com",
  "address": "м. Львів, вул. Франка, 15",
  "status": "ACTIVE",
  "loyaltyLevel": "STANDARD",
  "totalSpent": 0.0,
  "loyaltyPoints": 0,
  "birthdate": "1990-05-15",
  "gender": "FEMALE",
  "source": "WEBSITE",
  "notes": "Цікавиться послугами чистки пальто",
  "tags": ["новий", "онлайн"],
  "createdAt": "2023-10-10T12:30:00Z",
  "updatedAt": "2023-10-10T12:30:00Z"
}
```

### Оновлення клієнта

**Ендпоінт:** `PUT /v1/clients/{id}`

**Права доступу:** ADMIN, MANAGER

**Опис:** Оновлює існуючого клієнта за ідентифікатором

**Параметри шляху:**
- `id` - UUID ідентифікатор клієнта

**Запит:**
```json
{
  "fullName": "Ірина Коваленко-Шевченко",
  "phone": "+380671234567",
  "email": "iryna.new@example.com",
  "address": "м. Львів, вул. Франка, 17",
  "status": "ACTIVE",
  "tags": ["постійний", "онлайн"]
}
```

**Відповідь:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "fullName": "Ірина Коваленко-Шевченко",
  "phone": "+380671234567",
  "email": "iryna.new@example.com",
  "address": "м. Львів, вул. Франка, 17",
  "status": "ACTIVE",
  "loyaltyLevel": "STANDARD",
  "totalSpent": 0.0,
  "loyaltyPoints": 0,
  "birthdate": "1990-05-15",
  "gender": "FEMALE",
  "source": "WEBSITE",
  "notes": "Цікавиться послугами чистки пальто",
  "tags": ["постійний", "онлайн"],
  "updatedAt": "2023-10-10T14:45:00Z"
  // ... інші поля
}
```

### Видалення клієнта

**Ендпоінт:** `DELETE /v1/clients/{id}`

**Права доступу:** ADMIN, MANAGER

**Опис:** Видаляє клієнта за ідентифікатором

**Параметри шляху:**
- `id` - UUID ідентифікатор клієнта

**Відповідь:**
- HTTP Status: 204 No Content

### Отримання найбільш лояльних клієнтів

**Ендпоінт:** `GET /v1/clients/top/loyal`

**Права доступу:** ADMIN, MANAGER

**Опис:** Повертає список найбільш лояльних клієнтів

**Параметри запиту:**
- `limit` - Кількість клієнтів (за замовчуванням 10)

**Відповідь:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "fullName": "Андрій Петренко",
    "phone": "+380501234567",
    "email": "andriy@example.com",
    "address": "м. Київ, вул. Хрещатик, 1",
    "status": "ACTIVE",
    "loyaltyLevel": "PLATINUM",
    "totalSpent": 35800.5,
    "loyaltyPoints": 1580
    // ... інші поля
  },
  // ... інші клієнти
]
```

### Отримання клієнтів з найбільшою сумою замовлень

**Ендпоінт:** `GET /v1/clients/top/spending`

**Права доступу:** ADMIN, MANAGER

**Опис:** Повертає список клієнтів з найбільшою сумою замовлень

**Параметри запиту:**
- `limit` - Кількість клієнтів (за замовчуванням 10)

**Відповідь:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "fullName": "Олександр Сидоренко",
    "phone": "+380671234567",
    "email": "olexandr@example.com",
    "address": "м. Одеса, вул. Дерибасівська, 10",
    "status": "ACTIVE",
    "loyaltyLevel": "GOLD",
    "totalSpent": 45800.5,
    "loyaltyPoints": 980
    // ... інші поля
  },
  // ... інші клієнти
]
```

## Обробка помилок

### Коди помилок

| Код HTTP | Опис |
|----------|----------|
| 400 | Неправильний запит (Bad Request) |
| 401 | Не авторизований (Unauthorized) |
| 403 | Доступ заборонено (Forbidden) |
| 404 | Ресурс не знайдено (Not Found) |
| 409 | Конфлікт (наприклад, клієнт з таким email вже існує) |
| 500 | Внутрішня помилка сервера |

### Формат помилки

```json
{
  "timestamp": "2023-10-10T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for object='clientCreateRequest'",
  "path": "/v1/clients"
}
```

## Рекомендації для фронтенд-розробників

1. **Обробка помилок**: Завжди перевіряйте статус відповіді. Для 4xx та 5xx помилок розробіть уніфікований механізм обробки з інформативними повідомленнями для користувача.

2. **Пагінація**: При роботі зі списками використовуйте пагінацію. У компоненті пагінації враховуйте `totalPages` та `totalElements` з відповіді.

3. **Кешування**: Для часто використовуваних даних, які рідко змінюються (наприклад, довідники), використовуйте кешування на стороні клієнта.

4. **Валідація**: Перед відправкою даних на сервер виконуйте клієнтську валідацію, щоб зменшити кількість запитів з помилками.

## Приклади використання з fetch API

### Приклад пошуку клієнтів

```javascript
async function searchClients(searchParams) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Необхідна автентифікація');
    }
    
    const response = await fetch('http://localhost:8080/v1/clients/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(searchParams),
    });
    
    if (!response.ok) {
      // Перевіряємо, чи є помилка пов'язана з закінченням терміну дії токена
      if (response.status === 401) {
        // Спроба оновити токен
        const refreshed = await refreshToken();
        if (refreshed) {
          return searchClients(searchParams); // Повторюємо запит з новим токеном
        }
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка завантаження клієнтів');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Помилка пошуку клієнтів:', error);
    throw error;
  }
}
```
