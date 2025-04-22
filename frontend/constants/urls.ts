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

// URL для серверних запитів (Next.js API → Java Backend)
export const SERVER_API_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://backend:8080' // Docker service name in production
    : 'http://localhost:8080'; // Local development

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
