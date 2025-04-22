/**
 * OpenAPI TypeScript Fetch клієнт для проекту Aksi-app
 *
 * Документація: https://openapi-ts.dev/openapi-fetch/middleware-auth
 */
import { Fetcher } from 'openapi-typescript-fetch';
import type { paths } from './schema';
import { SERVER_API_URL, API_PREFIX } from '@/constants/urls';

// Функція для отримання токена з cookies
const getTokenFromCookies = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;

  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];
};

// Створюємо функцію для отримання заголовків з токеном авторизації
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  // Додаємо заголовок Authorization, якщо є токен
  const token = getTokenFromCookies();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Створюємо типізований Fetcher для нашого API
export const fetcher = Fetcher.for<paths>();

// Налаштовуємо базову URL-адресу та враховуємо контекстний шлях /api
fetcher.configure({
  baseUrl: `${SERVER_API_URL}${API_PREFIX}`,
  init: {
    // ВАЖЛИВО: включаємо передачу cookies з JWT токенами
    credentials: 'include',
    headers: getAuthHeaders(),
  },
});

/**
 * Монопатч для оновлення fetcher при зміні токена
 * Викликайте цю функцію після логіну або логауту
 */
export const updateFetcherAuth = (): void => {
  // Повторно конфігуруємо fetcher з оновленими заголовками
  fetcher.configure({
    baseUrl: `${SERVER_API_URL}${API_PREFIX}`,
    init: {
      credentials: 'include',
      headers: getAuthHeaders(),
    },
  });

  console.log('Fetcher оновлено з новими токенами автентифікації');
};

/**
 * Функція для отримання токена з cookies
 * Може бути використана для зручності в інших місцях коду
 */
export const getAuthToken = (): string | undefined => {
  return getTokenFromCookies();
};

/**
 * Типи для роботи з відповідями API
 */
export type ApiResponse<T> = {
  data: T;
  status: number;
  headers: Record<string, string>;
};
