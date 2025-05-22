'use client';

import axios from 'axios';

import { useAuthStore } from '@/features/auth/store';

import type { AxiosError } from 'axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';

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
    console.error(
      `🔴 API Error [${this.status}] ${this.errorId || ''}: ${this.message}`
    );
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
        message:
          responseData.message ||
          error.message ||
          "Помилка з'єднання з сервером",
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

console.log('[axios.ts] Ініціалізація з API URL:', baseURL); // Логування для відстеження URL

/**
 * Допоміжні функції для роботи з токеном у non-React контексті
 * При використанні HttpOnly cookies - токени недоступні клієнтському JS
 * тому залишаємо цей клас для сумісності, але токени будуть автоматично
 * передаватися з браузера з withCredentials: true
 */
const authTokenManager = {
  // Токени зберігаються в HttpOnly cookies, тому JS не може їх прочитати
  // Ці методи залишені для сумісності
  getToken: (): string | undefined => {
    // Реальний токен зберігається в HttpOnly cookies і недоступний для JS
    return undefined;
  },
  getRefreshToken: (): string | undefined => {
    // Реальний refreshToken зберігається в HttpOnly cookies і недоступний для JS
    return undefined;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTokens: (..._args: string[]): void => {
    // У новій архітектурі токени встановлюються через API маршрути
    console.log('Token management handled by server-side API routes');
  },
  clearTokens: (): void => {
    // Викликаємо logout для очищення стану авторизації
    useAuthStore.getState().logout();
  },
};

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // Таймаут запиту 10 секунд
  withCredentials: true, // Завжди передавати cookies в запитах
});

// Додаємо логування запитів та відповідей
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      '[axios.ts] API Request:',
      config.method?.toUpperCase(),
      config.url,
      'Full URL:',
      `${config.baseURL}${config.url || ''}`,
      config.data
    );

    // Не додаємо Authorization заголовок з JS,
    // оскільки використовуємо HttpOnly cookies, які
    // автоматично передаються з браузера при withCredentials: true
    // Цей токен буде порожнім, тому що він у HttpOnly cookies
    return config;
  },
  (error) => Promise.reject(error)
);

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

// Оновлення токена авторизації
async function handleTokenRefresh() {
  const refreshToken = authTokenManager.getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }
  
  try {
    const response = await apiClient.post(
      '/auth/refresh-token',
      refreshToken,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );

    // Отримуємо нові токени
    const {
      token,
      refreshToken: newRefreshToken,
      expiresAt,
    } = response.data;

    // Оновлюємо токени
    authTokenManager.setTokens(token, newRefreshToken, expiresAt);
    
    return token;
  } catch {
    // Ігноруємо помилку, повертаємо null для обробки в основній функції
    return null;
  }
}

// Обробка запитів у черзі після оновлення токена
function processQueue(token: string | null) {
  if (!token) {
    // Відхиляємо всі запити у черзі, якщо токен не оновлено
    failedQueue.forEach((req) => {
      req.reject(new Error('Помилка оновлення токена'));
    });
  } else {
    // Оновлюємо заголовки та виконуємо запити
    failedQueue.forEach((req) => {
      if (req.originalRequest.headers) {
        req.originalRequest.headers.Authorization = `Bearer ${token}`;
      }
      req.resolve(apiClient(req.originalRequest));
    });
  }
  
  // Очищуємо чергу
  failedQueue = [];
}

// Детальне логування помилок API
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
  if (process.env.NEXT_PUBLIC_DEBUG === 'true' && errorData.stackTrace) {
    console.error('Стек трейс помилки:', errorData.stackTrace);
  }
}

// Обробка помилок відповіді
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.status, response.config.url);
    console.log('Response data:', JSON.stringify(response.data));
    return response;
  },
  async (error: AxiosError) => {
    // Створюємо розширену помилку API для кращого логування
    const apiError = ApiError.fromAxiosError(error);

    // Базове логування помилки
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      apiError.logToConsole();
    } else {
      console.error('API Error:', error.message, error.config?.url);
    }

    // Без доступу до window на сервері пропускаємо решту обробки
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    
    // Обробка HTTP-статусів
    return handleErrorByStatus(error, originalRequest);
  }
);

/**
 * Обробка помилок за HTTP статусами
 */
async function handleErrorByStatus(error: AxiosError, originalRequest: AxiosRequestConfig) {
  // Обробка 401 Unauthorized помилки
  if (error.response?.status === 401) {
    return handleUnauthorizedError(error, originalRequest);
  }

  // Обробка 403 Forbidden
  if (error.response?.status === 403) {
    const callbackUrl = window.location.pathname + window.location.search;
    window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }

  // Логування деталей помилки
  logApiError(error);

  return Promise.reject(error);
}

/**
 * Обробка 401 Unauthorized помилки
 */
async function handleUnauthorizedError(error: AxiosError, originalRequest: AxiosRequestConfig) {
  // Перевіряємо, чи це не запит на оновлення токена
  if (originalRequest.url?.includes('refresh-token')) {
    authTokenManager.clearTokens();
    window.location.href = '/login';
    return Promise.reject(error);
  }
  
  // Додаємо запит до черги, якщо вже йде оновлення токена
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, originalRequest });
    });
  }
  
  // Починаємо процес оновлення токена
  isRefreshing = true;
  
  try {
    const token = await handleTokenRefresh();
    
    // Оновлюємо заголовок оригінального запиту
    if (token && originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${token}`;
    }
    
    // Обробляємо чергу запитів
    processQueue(token);
    
    // Повторюємо запит або перенаправляємо на логін
    if (token) {
      return apiClient(originalRequest);
    } 
    
    // Перенаправляємо на логін
    authTokenManager.clearTokens();
    window.location.href = '/login';
    return Promise.reject(error);
  } catch (refreshError) {
    processQueue(null);
    authTokenManager.clearTokens();
    window.location.href = '/login';
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}

// Допоміжні функції для роботи з API
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((response) => response.data),

  post: <T>(url: string, data?: Record<string, unknown>) =>
    apiClient.post<T>(url, data).then((response) => response.data),

  put: <T>(url: string, data?: Record<string, unknown>) =>
    apiClient.put<T>(url, data).then((response) => response.data),

  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((response) => response.data),
};

export default apiClient;
