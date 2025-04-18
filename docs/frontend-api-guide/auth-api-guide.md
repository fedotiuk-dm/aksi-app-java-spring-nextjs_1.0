# Документація API автентифікації для фронтенд-розробників

## Огляд

У цьому документі описано API для автентифікації користувачів у системі управління хімчисткою AKSI.
Документація розроблена спеціально для фронтенд-розробників і містить практичні рекомендації
з використання API, а також приклади інтеграції з Next.js 15.3.0.

## Базові URL

**Development:**

```
http://localhost:8080
```

**Production:**

```
https://api.aksi-app.com
```

## Ендпоінти автентифікації

### 1. Логін користувача

**Ендпоінт:** `POST /api/auth/login`

**Опис:** Аутентифікує користувача за логіном та паролем і повертає JWT токен.

**Заголовки запиту:**

```
Content-Type: application/json
```

**Тіло запиту:**

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Приклад успішної відповіді (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-04-19T13:15:30Z",
  "username": "your_username"
}
```

**Можливі помилки:**

- `400 Bad Request` - Неправильний формат запиту або відсутні обов'язкові поля
- `401 Unauthorized` - Невірний логін або пароль
- `500 Internal Server Error` - Внутрішня помилка сервера

### 2. Оновлення токену

**Ендпоінт:** `POST /api/auth/refresh-token`

**Опис:** Оновлює JWT токен за допомогою refresh токену.

**Заголовки запиту:**

```
Content-Type: text/plain
```

**Тіло запиту:** Рядок з refresh токеном

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Приклад успішної відповіді (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Новий JWT токен
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Новий refresh токен
  "expiresAt": "2025-04-19T15:15:30Z",
  "username": "your_username"
}
```

**Можливі помилки:**

- `400 Bad Request` - Неправильний формат запиту
- `401 Unauthorized` - Невірний або прострочений refresh токен
- `500 Internal Server Error` - Внутрішня помилка сервера

### 3. Вихід із системи

**Ендпоінт:** `POST /api/auth/logout`

**Опис:** Виконує вихід користувача із системи, анулюючи активні токени.

**Заголовки запиту:**

```
Authorization: Bearer your_jwt_token
Content-Type: application/json
```

**Тіло запиту:**

```json
{}
```

**Приклад успішної відповіді (200 OK):**

```json
{
  "success": true
}
```

**Примітка:** Навіть якщо запит повертає помилку на сервері, на клієнті все одно слід виконати вихід користувача шляхом видалення cookies.

## Оновлена реалізація автентифікації для Next.js 15.3.0

### Основні зміни та особливості

1. **HttpOnly Cookies API**: Використовується оновлений API для роботи з cookies у Next.js 15.3.0
2. **Серверні компоненти**: Підтримка нової архітектури App Router та Server Components
3. **Типізація**: Розширена типізація для роботи з cookies API
4. **Структурований підхід до логування**: Детальне логування процесу авторизації

### Збереження токенів

**На серверній стороні Next.js:**

- JWT токен та Refresh токен зберігаються в HTTP-only cookies для підвищеної безпеки
- Використовується функція `cookies()` з модуля `next/headers`
- Всі cookies мають налаштування `httpOnly: true` та `secure: true` (у production)

### Тип CookieStore для роботи з cookies API

У зв'язку з оновленням Next.js до версії 15.3.0, була створена спеціальна типізація для коректної роботи з cookies API:

```typescript
// Інтерфейс опцій для cookie
interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  domain?: string;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Типізована обгортка для cookies API
interface CookieStore {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  delete: (name: string) => void;
}
```

### Структура автентифікації (Feature-Sliced Design)

Наш проект використовує архітектуру Feature-Sliced Design для організації коду:

```
frontend/
  ├── features/
  │   ├── auth/
  │   │   ├── api/          # API клієнт для автентифікації
  │   │   │   └── authApi.ts   # HTTP клієнт для автентифікації
  │   │   ├── components/    # UI компоненти (LoginForm, тощо)
  │   │   ├── hooks/         # React хуки (useLogin, useLogout)
  │   │   │   └── useLogin.ts   # Хук для логіну з підтримкою redirectTo
  │   │   ├── server/        # Серверні функції для Next.js
  │   │   │   └── serverAuth.ts  # Функції для роботи з cookies на сервері
  │   │   └── types/         # TypeScript типи та інтерфейси
  └── lib/
      └── axios.ts          # Налаштований Axios інстанс з інтерцепторами
```

### Приклад серверної аутентифікації з Next.js 15.3.0

```tsx
// features/auth/server/serverAuth.ts
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { AuthApiResponse, AuthUser, JwtPayload } from '../types/authTypes';

// Константи для назв cookies
const TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Інтерфейси для типізації cookies API
interface CookieOptions {
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  domain?: string;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
}

interface CookieStore {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  delete: (name: string) => void;
}

// Функція для конвертації відповіді API в AuthUser
const convertToAuthUser = (apiResponse: AuthApiResponse): AuthUser => {
  return {
    username: apiResponse.username,
    token: apiResponse.token,
    refreshToken: apiResponse.refreshToken,
    expiresAt: apiResponse.expiresAt,
  };
};

// Функції для роботи з аутентифікацією на сервері
const serverAuth = {
  // Логін користувача і збереження токенів в cookies
  login: async (
    username: string,
    password: string
  ): Promise<AuthUser | null> => {
    console.log(`[serverAuth] Attempting login for user: ${username}`);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        console.error(
          `[serverAuth] Login failed: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const data: AuthApiResponse = await response.json();
      console.log(`[serverAuth] Login successful for user: ${data.username}`);

      // Зберігаємо токени в cookies
      const cookieStore = cookies() as unknown as CookieStore;

      // Встановлення Access Token
      const tokenExpiry = new Date(data.expiresAt);
      cookieStore.set(TOKEN_COOKIE, data.token, {
        expires: tokenExpiry,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
      });

      // Встановлення Refresh Token
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30); // 30 днів
      cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
        expires: refreshTokenExpiry,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
      });

      return convertToAuthUser(data);
    } catch (error) {
      console.error('[serverAuth] Login error:', error);
      return null;
    }
  },

  // Отримання поточного користувача
  getCurrentUser: async (): Promise<AuthUser | null> => {
    console.log('[serverAuth] Getting current user');

    try {
      const cookieStore = cookies() as unknown as CookieStore;
      const tokenCookie = cookieStore.get(TOKEN_COOKIE);

      if (!tokenCookie || !tokenCookie.value) {
        console.log('[serverAuth] No token cookie found');
        return null;
      }

      const token = tokenCookie.value;

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          console.log('[serverAuth] Token expired, attempting refresh');
          return await serverAuth.refreshToken();
        }

        // Маючи валідний токен, також повертаємо refresh token
        const refreshTokenCookie = cookieStore.get(REFRESH_TOKEN_COOKIE);
        const refreshToken = refreshTokenCookie?.value || '';

        return {
          username: decoded.sub || '',
          token,
          refreshToken,
          expiresAt: new Date(decoded.exp! * 1000).toISOString(),
        };
      } catch (error) {
        console.error('[serverAuth] Error decoding token:', error);
        return null;
      }
    } catch (error) {
      console.error('[serverAuth] Error getting current user:', error);
      return null;
    }
  },

  // Решта методів (logout, refreshToken, hasRole, getToken)...
};

export default serverAuth;
```

### Приклад інтеграції на клієнті з хуком для логіну

```tsx
// features/auth/hooks/useLogin.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../api/authApi';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (
    credentials: { username: string; password: string },
    redirectTo: string = '/dashboard'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(credentials.username, credentials.password);

      if (response) {
        console.log('[useLogin] Login successful, redirecting to:', redirectTo);
        router.push(redirectTo);
      } else {
        setError(
          "Не вдалося авторизуватися. Перевірте ім'я користувача та пароль."
        );
      }
    } catch (err: any) {
      console.error('[useLogin] Login error:', err);
      setError(err.message || 'Помилка під час авторизації');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
};
```

### Приклад використання в компоненті форми логіну

```tsx
// features/auth/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({
  redirectTo = '/dashboard',
}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isLoading, error } = useLogin();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ username, password }, redirectTo);
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Ім'я користувача"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Пароль"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Авторизація...' : 'Увійти'}
      </Button>
    </Box>
  );
}
```

## Рекомендації з тестування авторизації

1. **Перевірка HTTP-only cookie:**

   - Після логіну перевірте наявність HTTP-only cookie у браузері
   - Використовуйте вкладку Application > Cookies у Chrome DevTools

2. **Моніторинг помилок:**

   - Стежте за консоллю браузера на наявність помилок авторизації
   - Використовуйте лог повідомлення в серверній консолі для діагностики

3. **Перевірка редиректів:**
   - Перевірте коректну роботу редиректів на захищені сторінки
   - Переконайтеся в коректній роботі параметра `redirectTo` в URL
