# API документация для фронтенд-разработчиков

## Общая информация

Эта документация содержит подробное описание API для интеграции с фронтенд-частью приложения. Все эндпоинты представлены с примерами запросов и ответов.

### Базовые URL

Сервер доступен по следующим базовым URL:
- `http://localhost:8080`
- `https://aksi-app.com` (production)

### Аутентификация

Для защищенных эндпоинтов необходимо передавать JWT токен в заголовке:

```
Authorization: Bearer {your_jwt_token}
```

Токен получается при регистрации или входе пользователя и имеет ограниченный срок действия.

### Формат ответов

Все ответы возвращаются в формате JSON.

## Аутентификация и авторизация

### Регистрация пользователя

**Endpoint:** `POST /auth/register` или `POST /api/auth/register` или `POST /api/v1/auth/register` или `POST /v1/auth/register`

**Описание:** Создает нового пользователя и возвращает JWT токен

**Запрос:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "fullName": "New User",
  "phone": "+380501234567"
}
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-10-10T14:00:00Z",
  "username": "newuser"
}
```

### Вход пользователя

**Endpoint:** `POST /auth/login` или `POST /api/auth/login` или `POST /api/v1/auth/login` или `POST /v1/auth/login`

**Описание:** Аутентифицирует пользователя и возвращает JWT токен

**Запрос:**
```json
{
  "username": "user",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-10-10T14:00:00Z",
  "username": "user"
}
```

### Обновление токена

**Endpoint:** `POST /auth/refresh-token` или `POST /api/auth/refresh-token` или `POST /api/v1/auth/refresh-token` или `POST /v1/auth/refresh-token`

**Описание:** Обновляет JWT токен с помощью refresh токена

**Запрос:**
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
(Просто строка с refresh токеном)

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-10-10T16:00:00Z",
  "username": "user"
}
```

### Проверка работоспособности

**Endpoint:** `GET /auth/test` или `GET /api/auth/test` или `GET /api/v1/auth/test` или `GET /v1/auth/test`

**Описание:** Тестовый эндпоинт для проверки доступности аутентификации

**Ответ:**
```
"Auth endpoint is working!"
```

## Управление клиентами

### Поиск клиентов

**Endpoint:** `POST /v1/clients/search`

**Права доступа:** ADMIN, MANAGER, STAFF

**Описание:** Возвращает список клиентов с пагинацией, сортировкой и фильтрацией

**Запрос:**
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

**Ответ:**
```json
{
  "content": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "fullName": "Петр Иванов",
      "phone": "+380501234567",
      "email": "petr@example.com",
      "address": "м. Київ, вул. Хрещатик, 1",
      "status": "ACTIVE",
      "loyaltyLevel": "GOLD",
      "totalSpent": 15800.5,
      "loyaltyPoints": 580,
      "lastPurchaseAt": "2023-09-20T14:20:00Z"
    },
    // ... другие клиенты
  ],
  "totalElements": 35,
  "totalPages": 4,
  "number": 0,
  "size": 10
}
```

### Получение клиента по ID

**Endpoint:** `GET /v1/clients/{id}`

**Права доступа:** ADMIN, MANAGER, STAFF

**Описание:** Возвращает клиента по идентификатору

**Параметры пути:**
- `id` - UUID идентификатор клиента

**Ответ:**
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
  // ... другие поля
}
```

### Создание клиента

**Endpoint:** `POST /v1/clients`

**Права доступа:** ADMIN, MANAGER, STAFF

**Описание:** Создает нового клиента с переданными данными

**Запрос:**
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

**Ответ:**
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

### Обновление клиента

**Endpoint:** `PUT /v1/clients/{id}`

**Права доступа:** ADMIN, MANAGER

**Описание:** Обновляет существующего клиента по идентификатору

**Параметры пути:**
- `id` - UUID идентификатор клиента

**Запрос:**
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

**Ответ:**
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
  // ... другие поля
}
```

### Удаление клиента

**Endpoint:** `DELETE /v1/clients/{id}`

**Права доступа:** ADMIN, MANAGER

**Описание:** Удаляет клиента по идентификатору

**Параметры пути:**
- `id` - UUID идентификатор клиента

**Ответ:**
- HTTP Status: 204 No Content

### Получение самых лояльных клиентов

**Endpoint:** `GET /v1/clients/top/loyal`

**Права доступа:** ADMIN, MANAGER

**Описание:** Возвращает список самых лояльных клиентов

**Параметры запроса:**
- `limit` - Количество клиентов (по умолчанию 10)

**Ответ:**
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
    // ... другие поля
  },
  // ... другие клиенты
]
```

### Получение клиентов с наибольшей суммой заказов

**Endpoint:** `GET /v1/clients/top/spending`

**Права доступа:** ADMIN, MANAGER

**Описание:** Возвращает список клиентов с наибольшей суммой заказов

**Параметры запроса:**
- `limit` - Количество клиентов (по умолчанию 10)

**Ответ:**
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
    // ... другие поля
  },
  // ... другие клиенты
]
```

## Обработка ошибок

### Коды ошибок

| Код HTTP | Описание |
|----------|----------|
| 400 | Неверный запрос (Bad Request) |
| 401 | Не авторизован (Unauthorized) |
| 403 | Доступ запрещен (Forbidden) |
| 404 | Ресурс не найден (Not Found) |
| 409 | Конфликт (например, клиент с таким email уже существует) |
| 500 | Внутренняя ошибка сервера |

### Формат ошибки

```json
{
  "timestamp": "2023-10-10T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for object='clientCreateRequest'",
  "path": "/v1/clients"
}
```

## Рекомендации для фронтенд-разработчиков

1. **Обработка токенов**: Храните JWT токен в localStorage или в памяти приложения. Используйте refresh token для автоматического обновления основного токена.

2. **Обработка ошибок**: Всегда проверяйте статус ответа. Для 4xx и 5xx ошибок разработайте унифицированный механизм обработки с информативными сообщениями для пользователя.

3. **Пагинация**: При работе со списками используйте пагинацию. В компоненте пагинации учитывайте `totalPages` и `totalElements` из ответа.

4. **Кэширование**: Для часто используемых данных, которые редко меняются (например, справочники), используйте кэширование на стороне клиента.

5. **Валидация**: Перед отправкой данных на сервер выполняйте клиентскую валидацию, чтобы уменьшить количество запросов с ошибками.

## Примеры использования с fetch API

### Пример входа пользователя

```javascript
async function login(username, password) {
  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка входа');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

### Пример получения списка клиентов

```javascript
async function searchClients(searchParams) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Необходима аутентификация');
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
      // Проверяем, является ли ошибка связанной с истечением срока токена
      if (response.status === 401) {
        // Попытка обновить токен
        const refreshed = await refreshToken();
        if (refreshed) {
          return searchClients(searchParams); // Повторяем запрос с новым токеном
        }
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка загрузки клиентов');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Search clients error:', error);
    throw error;
  }
}

async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }
    
    const response = await fetch('http://localhost:8080/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: refreshToken,
    });
    
    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return false;
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return true;
  } catch (error) {
    console.error('Refresh token error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return false;
  }
}
```
