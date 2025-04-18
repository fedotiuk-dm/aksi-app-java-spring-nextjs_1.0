'use client';

import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

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
 * Напряму доступаємося до стору без використання хуків
 */
const authTokenManager = {
  getToken: (): string | undefined => {
    return useAuthStore.getState().user?.token;
  },
  getRefreshToken: (): string | undefined => {
    return useAuthStore.getState().user?.refreshToken;
  },
  setTokens: (token: string, refreshToken: string, expiresAt: string): void => {
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      useAuthStore.setState({
        user: {
          ...currentUser,
          token,
          refreshToken,
          expiresAt,
        },
      });
    }
  },
  clearTokens: (): void => {
    useAuthStore.getState().logout();
  },
};

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Таймаут запиту 10 секунд
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

    const token = authTokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    // Детальне логування в консоль із форматуванням
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      apiError.logToConsole();
    } else {
      console.error('API Error:', error.message, error.config?.url);
    }

    const originalRequest = error.config;

    // Доступ до localStorage лише на клієнті
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // Обробка 401 Unauthorized помилки (закінчився термін дії токена)
    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = authTokenManager.getRefreshToken();

      // Якщо немає токена оновлення або вже йде процес оновлення
      if (!refreshToken || isRefreshing) {
        // Перевіряємо, чи це не запит на оновлення токена
        if (originalRequest.url?.includes('refresh-token')) {
          // Виходимо з системи, якщо refresh token невалідний
          authTokenManager.clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Додаємо запит до черги очікування
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        });
      }

      isRefreshing = true;

      try {
        // Запит на оновлення токена
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

        // Оновлюємо токени в сторі
        authTokenManager.setTokens(token, newRefreshToken, expiresAt);

        // Оновлюємо заголовок оригінального запиту та запитів у черзі
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        // Виконуємо запити з черги з новим токеном
        failedQueue.forEach((req) => {
          if (req.originalRequest.headers) {
            req.originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          req.resolve(apiClient(req.originalRequest));
        });

        failedQueue = [];

        // Повторюємо оригінальний запит з новим токеном
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Помилка оновлення токена - виходимо з системи
        failedQueue.forEach((req) => {
          req.reject(refreshError);
        });

        failedQueue = [];

        // Очищуємо дані автентифікації та перенаправляємо на сторінку входу
        authTokenManager.clearTokens();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Перевіряємо статус 403 (Forbidden)
    if (error.response?.status === 403) {
      // Зберігаємо поточний URL для повернення після логіну
      const callbackUrl = window.location.pathname + window.location.search;
      // Перенаправляємо на сторінку логіну з параметром повернення
      window.location.href = `/login?callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`;
    }

    // Детальне логування структурованих помилок
    if (error.response?.data) {
      // Виводимо детальні дані про помилку
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

      // Виводимо стек трейс якщо він є та налаштований режим розробки
      if (process.env.NEXT_PUBLIC_DEBUG === 'true' && errorData.stackTrace) {
        console.error('Стек трейс помилки:', errorData.stackTrace);
      }
    } else if (error.request) {
      // Запит був зроблений, але відповіді немає (мережева помилка)
      console.error('Немає відповіді від сервера', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        message: error.message,
      });
    } else {
      // Сталася помилка при налаштуванні запиту
      console.error('Помилка налаштування запиту:', error.message);
    }

    return Promise.reject(error);
  }
);

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
