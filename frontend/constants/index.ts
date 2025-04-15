/**
 * API шляхи
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    REGISTER: '/auth/register',
  },
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: string) => `/clients/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
  },
  SERVICES: {
    BASE: '/services',
    BY_ID: (id: string) => `/services/${id}`,
    CATEGORIES: '/api/v1/services/categories',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
};

/**
 * Маршрути додатку
 */
export const APP_ROUTES = {
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: '/dashboard',
  CLIENTS: {
    LIST: '/clients',
    DETAILS: (id: string) => `/clients/${id}`,
    NEW: '/clients/new',
    EDIT: (id: string) => `/clients/${id}/edit`,
  },
  ORDERS: {
    LIST: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
    NEW: '/orders/new',
    EDIT: (id: string) => `/orders/${id}/edit`,
  },
  SERVICES: {
    LIST: '/services',
    CATEGORIES: '/services/categories',
  },
  SETTINGS: '/settings',
};

/**
 * Кількість елементів на сторінці для пагінованих списків
 */
export const ITEMS_PER_PAGE = 10;

/**
 * Формати дат
 */
export const DATE_FORMATS = {
  DATE: 'DD.MM.YYYY',
  DATE_TIME: 'DD.MM.YYYY HH:mm',
  TIME: 'HH:mm',
};
