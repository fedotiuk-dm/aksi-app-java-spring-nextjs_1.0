# API документація для аутентифікації та авторизації

## Загальна інформація

Ця документація містить детальний опис API для інтеграції з фронтенд-частиною додатку. Усі ендпоінти представлені з прикладами запитів та відповідей.

### Базові URL

Сервер доступний за наступними базовими URL:
- `http://localhost:8080`
- `https://aksi-app.com` (production)

### Аутентифікація

Для захищених ендпоінтів необхідно передавати JWT токен у заголовку:

```
Authorization: Bearer {your_jwt_token}
```

Токен отримується при реєстрації або вході користувача і має обмежений термін дії.

### Формат відповідей

Усі відповіді повертаються у форматі JSON.

## Аутентифікація та авторизація

### Реєстрація користувача

**Ендпоінт:** `POST /auth/register` або `POST /api/auth/register` або `POST /api/v1/auth/register` або `POST /v1/auth/register`

**Опис:** Створює нового користувача та повертає JWT токен

**Запит:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "fullName": "Новий Користувач",
  "phone": "+380501234567"
}
```

**Відповідь:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-10-10T14:00:00Z",
  "username": "newuser"
}
```

### Вхід користувача

**Ендпоінт:** `POST /auth/login` або `POST /api/auth/login` або `POST /api/v1/auth/login` або `POST /v1/auth/login`

**Опис:** Автентифікує користувача та повертає JWT токен

**Запит:**
```json
{
  "username": "user",
  "password": "password123"
}
```

**Відповідь:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-10-10T14:00:00Z",
  "username": "user"
}
```

### Оновлення токена

**Ендпоінт:** `POST /auth/refresh-token` або `POST /api/auth/refresh-token` або `POST /api/v1/auth/refresh-token` або `POST /v1/auth/refresh-token`

**Опис:** Оновлює JWT токен за допомогою refresh токена

**Запит:**
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
(Просто рядок із refresh токеном)

**Відповідь:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-10-10T16:00:00Z",
  "username": "user"
}
```

### Перевірка працездатності

**Ендпоінт:** `GET /auth/test` або `GET /api/auth/test` або `GET /api/v1/auth/test` або `GET /v1/auth/test`

**Опис:** Тестовий ендпоінт для перевірки доступності автентифікації

**Відповідь:**
```
"Auth endpoint is working!"
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
  "message": "Validation failed for object='loginRequest'",
  "path": "/auth/login"
}
```

## Рекомендації для фронтенд-розробників

1. **Обробка токенів**: Зберігайте JWT токен у localStorage або в пам'яті додатку. Використовуйте refresh token для автоматичного оновлення основного токена.

2. **Обробка помилок**: Завжди перевіряйте статус відповіді. Для 4xx та 5xx помилок розробіть уніфікований механізм обробки з інформативними повідомленнями для користувача.

## Приклади використання з fetch API

### Приклад входу користувача

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
      throw new Error(errorData.message || 'Помилка входу');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    console.error('Помилка входу:', error);
    throw error;
  }
}
```

### Приклад оновлення токену

```javascript
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
    console.error('Помилка оновлення токену:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return false;
  }
}
```
