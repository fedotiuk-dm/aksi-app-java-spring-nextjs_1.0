/**
 * Правила формування API URL в проекті:
 * 
 * 1. Важливо! Spring Boot має контекстний шлях /api
 *
 * 2. Для запитів з Next.js API роутів до бекенду:
 *    - Використовуйте: ${SERVER_API_URL}/api/resource_path
 *    - Приклад: const url = `${SERVER_API_URL}/api/clients`;
 *
 * 3. Для запитів від клієнта (React) до Next.js API:
 *    - Використовуйте: ${CLIENT_API_URL}/resource_path
 *    - Приклад: const url = `${CLIENT_API_URL}/clients`;
 */

// Контекстний шлях API - Spring Boot налаштований з /api префіксом

// URL для серверних запитів (Next.js API → Java Backend)
export const SERVER_API_URL =
//  process.env.NODE_ENV === 'production'
//    ? 'http://backend:8080' // Docker service name in production
//    : 'http://localhost:8080'; // Local development

// У Docker контейнері завжди використовуємо Docker service name
process.env.NEXT_PUBLIC_API_URL ? 
  process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : // Видаляємо '/api' з кінця для формування базового URL
  'http://backend:8080'; // Default для Docker

/**
 * Отримати базовий URL сервера API
 * Ця функція використовується в openapi-typescript-fetch для налаштування базового URL
 */
export const getServerApiUrl = (): string => {
  return SERVER_API_URL;
};

/**
 * Отримати повний URL API з урахуванням контекстного шляху
 * Використовуйте цю функцію при формуванні повних URL до бекенду
 */
export const getFullApiUrl = (path: string): string => {
  // Перевіряємо, чи шлях уже містить /api
  const apiPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : `/${path}`}`;
  return `${SERVER_API_URL}${apiPath}`;
};

// URL для клієнтських запитів (React → Next.js API)
export const CLIENT_API_URL = '/api';

// API префікс, який завжди використовується в запитах до бекенду
export const API_PREFIX = '/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
};
