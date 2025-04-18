/**
 * URL constants for API endpoints
 *
 * In Docker environment, we use service names for server-side requests
 * For local development, we use localhost
 */

// Server-side URLs (for direct backend communication from Next.js API routes)
export const SERVER_API_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://backend:8080' // Docker service name in production
    : 'http://localhost:8080'; // Local development

// Client-side URLs (for browser requests that go through Next.js API routes)
export const CLIENT_API_URL = '/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
};
