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

/**
 * Функція-утиліта для обробки помилок в реакт-компонентах
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return ApiError.fromAxiosError(error);
  }

  return new ApiError({
    status: 500,
    message: error instanceof Error ? error.message : 'Невідома помилка',
  });
};

// Отримуємо базовий URL API з змінних середовища
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

console.log('🔧 Axios baseURL:', baseURL);

/**
 * Створення основного екземпляру Axios з базовими налаштуваннями
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // Таймаут запиту 10 секунд
  withCredentials: true, // Завжди передавати cookies в запитах
});

// Логування запитів у режимі розробки
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use((config) => {
    // Фільтруємо чутливі маршрути
    const url = config.url || '';
    const isSensitive = url.includes('/auth/') || url.includes('/users/');

    if (!isSensitive) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  });

  apiClient.interceptors.response.use((response) => {
    // Фільтруємо чутливі маршрути
    const url = response.config.url || '';
    const isSensitive = url.includes('/auth/') || url.includes('/users/');

    if (!isSensitive) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  });
}

// Змінна для запобігання паралельному оновленню токена
let isRefreshing = false;

// Інтерфейс для елементів черги запитів
interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  originalRequest: AxiosRequestConfig;
}

// Черга запитів, що очікують завершення оновлення токена
let failedQueue: QueueItem[] = [];

/**
 * Оновлення токена авторизації через API роут
 */
async function refreshToken(): Promise<boolean> {
  try {
    // Викликаємо backend API для оновлення токена
    await apiClient.post('/api/auth/refresh-token', {});
    return true;
  } catch (error) {
    console.error('Помилка оновлення токена:', error);
    return false;
  }
}

/**
 * Обробка запитів у черзі після оновлення токена
 */
function processQueue(success: boolean) {
  failedQueue.forEach((item) => {
    if (success) {
      item.resolve(apiClient(item.originalRequest));
    } else {
      item.reject(new Error('Помилка оновлення токена'));
    }
  });

  failedQueue = [];
}

/**
 * Детальне логування помилок API
 */
function logApiError(error: AxiosError) {
  if (!error.response?.data) {
    if (error.request) {
      // Запит був зроблений, але відповіді немає
      console.error('Немає відповіді від сервера', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        message: error.message,
      });
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
  async (error: AxiosError) => {
    // Створюємо розширену помилку API для кращого логування
    const apiError = ApiError.fromAxiosError(error);

    // Логуємо помилку у режимі розробки
    if (process.env.NODE_ENV === 'development') {
      apiError.logToConsole();
    }

    // Без доступу до window на сервері пропускаємо решту обробки
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Обробка 401 Unauthorized помилки - спроба оновити токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Ігноруємо, якщо це вже запит на оновлення токена
      if (originalRequest.url?.includes('/api/auth/refresh-token')) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Якщо вже відбувається оновлення токена, додаємо запит у чергу
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        });
      }

      // Позначаємо, що запит вже був повторений після оновлення токену
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Оновлюємо токен через API роут
        const success = await refreshToken();

        // Обробляємо чергу запитів
        processQueue(success);

        if (success) {
          // Повторюємо оригінальний запит
          return apiClient(originalRequest);
        } else {
          // Перенаправляємо на логін
          useAuthStore.getState().logout();
          const callbackUrl = window.location.pathname + window.location.search;
          window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(false);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Обробка 403 Forbidden
    if (error.response?.status === 403) {
      useAuthStore.getState().logout();
      const callbackUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }

    // Логування деталей помилки
    logApiError(error);

    return Promise.reject(error);
  }
);

/**
 * Типізовані методи для зручної роботи з API
 */
export const api = {
  get: <T>(
    url: string,
    params?: Record<string, unknown>,
    config: Omit<AxiosRequestConfig, 'params'> = {}
  ) => apiClient.get<T>(url, { params, ...config }).then((response) => response.data),

  post: <T>(url: string, data?: unknown, config: AxiosRequestConfig = {}) =>
    apiClient.post<T>(url, data, config).then((response) => response.data),

  put: <T>(url: string, data?: unknown, config: AxiosRequestConfig = {}) =>
    apiClient.put<T>(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config: AxiosRequestConfig = {}) =>
    apiClient.delete<T>(url, config).then((response) => response.data),

  patch: <T>(url: string, data?: unknown, config: AxiosRequestConfig = {}) =>
    apiClient.patch<T>(url, data, config).then((response) => response.data),

  /**
   * Створює контролер скасування запиту та токен
   * @returns { AbortController, signal } - контролер і сигнал для скасування запиту
   */
  createAbortController: () => {
    const controller = new AbortController();
    return {
      controller,
      signal: controller.signal,
    };
  },
};

export default apiClient;
