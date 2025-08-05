'use client';

import axios from 'axios';
import type { AxiosError, AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';

import { useAuthStore } from '@/features/auth';


// Розширюємо тип AxiosRequestConfig для власних властивостей
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Інтерфейс для розширеної відповіді помилки з бекенду
 */
export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  message: string;
  errorType?: string;
  path?: string;
  method?: string;
  errorId?: string;
  errors?: Record<string, string>;
  stackTrace?: string[];
}

/**
 * Розширений клас помилки API
 */
export class ApiError extends Error {
  status: number;
  errorId?: string;
  timestamp?: string;
  path?: string;
  method?: string;
  errors?: Record<string, string>;
  stackTrace?: string[];
  errorType?: string;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = error.errorType || 'ApiError';
    this.status = error.status;
    this.errorId = error.errorId;
    this.timestamp = error.timestamp;
    this.path = error.path;
    this.method = error.method;
    this.errors = error.errors;
    this.stackTrace = error.stackTrace;
    this.errorType = error.errorType;
  }

  /**
   * Отримати дані для логування в консоль
   */
  getConsoleData(): Record<string, unknown> {
    const consoleData: Record<string, unknown> = {
      message: this.message,
      status: this.status,
    };

    if (this.errorId) consoleData.errorId = this.errorId;
    if (this.path) consoleData.path = this.path;
    if (this.method) consoleData.method = this.method;
    if (this.errorType) consoleData.errorType = this.errorType;
    if (this.errors) consoleData.validationErrors = this.errors;
    if (this.stackTrace) consoleData.stackTrace = this.stackTrace;

    return consoleData;
  }

  /**
   * Вивести детальну інформацію про помилку у консоль
   */
  logToConsole(): void {
    // Не логуємо Network Error та canceled - це нормальні ситуації
    if (this.message === 'Network Error' || this.message === 'canceled') {
      return;
    }
    console.error(`🔴 API Error [${this.status}] ${this.errorId || ''}: ${this.message}`);
    console.error(this.getConsoleData());
  }

  /**
   * Перетворює помилку Axios в ApiError
   */
  static fromAxiosError(error: AxiosError): ApiError {
    if (error.response?.data) {
      // Якщо сервер повернув структуровану помилку
      const responseData = error.response.data as Partial<ApiErrorResponse>;

      return new ApiError({
        status: error.response.status,
        message: responseData.message || error.message || "Помилка з'єднання з сервером",
        errorId: responseData.errorId,
        errorType: responseData.errorType,
        path: responseData.path,
        method: responseData.method,
        errors: responseData.errors,
        stackTrace: responseData.stackTrace,
      });
    }

    // Якщо немає структурованої відповіді
    return new ApiError({
      status: error.response?.status || 500,
      message: error.message || "Помилка з'єднання з сервером",
    });
  }
}

// Функція handleApiError була видалена, бо не використовується
// В проекті використовується обробка помилок через React Query та axios interceptors

// Конфігурація axios
const AXIOS_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 30000,
  // Шляхи, для яких не логуємо помилки
  silentPaths: ['/users/me', '/api/auth/session', '/test-headers', '/api/users'],
  // Типи помилок, які не логуємо
  silentErrors: ['Network Error', 'timeout', 'ECONNABORTED', 'canceled'],
};

// Логування конфігурації тільки в development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Axios configuration:', {
    baseURL: AXIOS_CONFIG.baseURL,
    timeout: AXIOS_CONFIG.timeout,
    withCredentials: true,
    currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'SSR',
  });
}

/**
 * Створення основного екземпляру Axios з базовими налаштуваннями
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: AXIOS_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: AXIOS_CONFIG.timeout,
  withCredentials: true, // Завжди передавати cookies в запитах
});

/**
 * Функція для читання cookie за назвою
 */
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Додавання CSRF токену до всіх небезпечних запитів
apiClient.interceptors.request.use((config) => {
  // Додаємо CSRF токен для POST, PUT, DELETE, PATCH запитів
  const method = config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }
  
  return config;
});

// Логування запитів у режимі розробки
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use((config) => {
    // Не логуємо чутливі маршрути
    const url = config.url || '';
    const isSilentPath = AXIOS_CONFIG.silentPaths.some(path => url.includes(path));

    if (!isSilentPath) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  });

  apiClient.interceptors.response.use((response) => {
    // Не логуємо чутливі маршрути
    const url = response.config.url || '';
    const isSilentPath = AXIOS_CONFIG.silentPaths.some(path => url.includes(path));

    if (!isSilentPath) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  });
}

// Cookie-based authentication не потребує refresh token логіки
// Сесія управляється на сервері і автоматично подовжується

/**
 * Детальне логування помилок API
 */
function logApiError(error: AxiosError) {
  // Не логуємо Network Error і деякі інші помилки
  if (AXIOS_CONFIG.silentErrors.some(msg => error.message?.includes(msg))) {
    return;
  }

  if (!error.response?.data) {
    if (error.request) {
      // Запит був зроблений, але відповіді немає
      // Перевіряємо чи це silent path
      const isSilentPath = AXIOS_CONFIG.silentPaths.some(path => error.config?.url?.includes(path));
      
      // Логуємо тільки в development режимі і якщо це не silent path
      if (process.env.NODE_ENV === 'development' && !isSilentPath) {
        console.error('Немає відповіді від сервера', {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          message: error.message,
        });
      }
    } else {
      // Помилка налаштування запиту
      console.error('Помилка налаштування запиту:', error.message);
    }
    return;
  }

  // Логування деталей помилки
  const errorData = error.response.data as Partial<ApiErrorResponse>;
  console.error('Деталі помилки:', {
    status: error.response.status,
    message: errorData.message || 'Помилка без повідомлення',
    errorId: errorData.errorId,
    path: errorData.path || error.config?.url,
    method: errorData.method || error.config?.method?.toUpperCase(),
    errors: errorData.errors,
    timestamp: errorData.timestamp,
  });

  // Виводимо стек трейс у режимі розробки
  if (process.env.NODE_ENV === 'development' && errorData.stackTrace) {
    console.error('Стек трейс помилки:', errorData.stackTrace);
  }
}

// Обробка помилок відповіді
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    // Перевіряємо чи запит був скасований
    if (axios.isCancel(error)) {
      // Для скасованих запитів просто відхиляємо без логування
      return Promise.reject(error);
    }
    
    // Перевіряємо чи це помилка Axios
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }
    
    // Тепер TypeScript знає, що error є AxiosError
    const axiosError = error as AxiosError;
    
    // Без доступу до window на сервері пропускаємо решту обробки
    if (typeof window === 'undefined') {
      return Promise.reject(axiosError);
    }

    const originalRequest = axiosError.config as ExtendedAxiosRequestConfig;
    if (!originalRequest) {
      return Promise.reject(axiosError);
    }

    // Створюємо розширену помилку API для кращого логування
    const apiError = ApiError.fromAxiosError(axiosError);

    // Логуємо помилку у режимі розробки (крім деяких маршрутів та типів помилок)
    const isNetworkError = axiosError.message === 'Network Error';
    const isCancelError = axiosError.message === 'canceled';
    const isSilentPath = AXIOS_CONFIG.silentPaths.some(path => originalRequest.url?.includes(path));
    
    if (process.env.NODE_ENV === 'development' && !isSilentPath && !isNetworkError && !isCancelError) {
      apiError.logToConsole();
    }

    // Обробка 500 Internal Server Error
    if (axiosError.response?.status === 500) {
      // Особлива обробка для /users/me - це може означати, що користувач не авторизований
      if (originalRequest.url?.includes('/users/me')) {
        console.log('📌 500 error on /users/me - user might not be authenticated');
        return Promise.reject(new ApiError({
          status: 401,
          message: 'Користувач не авторизований',
          path: '/users/me',
          method: 'GET'
        }));
      }

      // Для інших 500 помилок
      return Promise.reject(apiError);
    }

    // Спеціальна обробка для /users/me - не логуємо і не показуємо помилки
    if (originalRequest.url?.includes('/users/me')) {
      const status = axiosError.response?.status;
      if (status === 401 || status === 404 || status === 500) {
        // Тихо повертаємо помилку без логування
        return Promise.reject(new Error('User not authenticated'));
      }
    }

    // Обробка 401 Unauthorized - сесія закінчилась або користувач не авторизований
    if (axiosError.response?.status === 401) {
      // Ігноруємо 401 для певних шляхів (logout, session check)
      const ignorePaths = ['/auth/logout', '/auth/session', '/users/me'];
      if (ignorePaths.some(path => originalRequest.url?.includes(path))) {
        return Promise.reject(axiosError);
      }

      // Для інших запитів - перенаправляємо на логін
      useAuthStore.getState().logout();
      const callbackUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return Promise.reject(axiosError);
    }

    // Обробка 403 Forbidden
    if (axiosError.response?.status === 403) {
      // Не перенаправляємо на логін для /users/me
      if (!originalRequest.url?.includes('/users/me')) {
        useAuthStore.getState().logout();
        const callbackUrl = window.location.pathname + window.location.search;
        window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      }
    }

    // Логування деталей помилки
    logApiError(axiosError);

    return Promise.reject(axiosError);
  }
);

export default apiClient;
