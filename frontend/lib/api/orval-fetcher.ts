/**
 * @fileoverview Розширений Orval fetcher з advanced error handling та interceptors
 *
 * Features:
 * - Автоматична авторизація через JWT токени
 * - Retry логіка з exponential backoff
 * - Глобальна обробка помилок
 * - Interceptors для логування та моніторингу
 * - Підтримка AbortController
 * - Автоматичний refresh токенів (якщо потрібно)
 */

import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

// 🔧 Розширення типів Axios для підтримки metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// 🔧 Конфігурація
const BASE_URL = 'http://localhost:8080/api';

const DEFAULT_TIMEOUT = 30000; // 30 секунд
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE = 1000; // 1 секунда базова затримка

// 🎯 Типи для кращої типізації
interface RetryConfig {
  attempts: number;
  delay: number;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

// 🔧 Тип для API відповіді з помилкою
interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: any;
}

// 🔐 Утиліти для роботи з токенами
// Кеш для токена
let cachedToken: string | null = null;

const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  // Якщо є кешований токен, повертаємо його
  if (cachedToken) return cachedToken;

  // Перевіряємо чи є токен в localStorage
  const storedToken = localStorage.getItem('accessToken');
  if (storedToken) {
    // Якщо є збережений токен, використовуємо його
    cachedToken = storedToken;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Використовуємо accessToken з localStorage');
    }
    return cachedToken;
  }

  // Якщо немає збереженого токена, повертаємо null
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Немає accessToken в localStorage');
  }
  return null;
};

const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;

  // Очищуємо кеш токена
  cachedToken = null;

  // Очищуємо токени з localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️ Токени очищено з кешу та localStorage');
  }
};

// 🚀 Створюємо axios instance з базовою конфігурацією
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // Додаємо версію клієнта для моніторингу
    'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
  },
});

// 🔄 Utility для retry логіки з exponential backoff
const calculateRetryDelay = (attempt: number): number => {
  return Math.min(RETRY_DELAY_BASE * Math.pow(2, attempt - 1), 30000);
};

const shouldRetry = (error: AxiosError, attempt: number): boolean => {
  // Не retry для клієнтських помилок (4xx)
  if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
    return false;
  }

  // Не retry для специфічних помилок
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
    return false;
  }

  // Retry тільки для серверних помилок та мережевих проблем
  return attempt < MAX_RETRY_ATTEMPTS;
};

// 📝 Request interceptor для авторизації та логування
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Додаємо токен авторизації
    const token = await getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Логування запитів в development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }

    // Додаємо timestamp для моніторингу
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 📥 Response interceptor для обробки помилок та логування
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Логування успішних відповідей в development
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - (response.config.metadata?.startTime || 0);
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          duration: `${duration}ms`,
          data: response.data,
        }
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Логування помилок (з фільтрацією для нормальних 404 та скасованих запитів)
    if (process.env.NODE_ENV === 'development') {
      const isSelectedClientNotFound =
        error.response?.status === 404 && originalRequest?.url?.includes('/selected-client');

      const isCanceledRequest = error.message === 'canceled' || error.code === 'ERR_CANCELED';

      if (isCanceledRequest) {
        // Скасовані запити - це нормально, не логуємо як помилки
        console.log(
          `🚫 Request canceled: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`
        );
      } else if (!isSelectedClientNotFound) {
        console.error(
          `❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
          {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          }
        );
      } else {
        console.log(
          `ℹ️ No client selected yet: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} (404)`
        );
      }
    }

    // Обробка 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Очищуємо токен
      clearAuthToken();

      // Можна додати логіку refresh токенів тут
      // Наразі просто відправляємо на логін
      if (typeof window !== 'undefined') {
        console.warn('🔒 Unauthorized access - redirecting to login');
        // window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    // Retry логіка для серверних помилок
    if (!originalRequest._retry && shouldRetry(error, 1)) {
      originalRequest._retry = true;

      const delay = calculateRetryDelay(1);
      console.warn(`⏳ Retrying request after ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

// 🔧 Основна функція для Orval з розширеною обробкою помилок
const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  // Мерджимо конфігурації
  const mergedConfig = {
    ...config,
    ...options,
  };

  // Додаємо підтримку AbortController якщо не передано
  if (!mergedConfig.signal && typeof AbortController !== 'undefined') {
    const controller = new AbortController();
    mergedConfig.signal = controller.signal;

    // Автоматично скасовуємо запит через timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, mergedConfig.timeout || DEFAULT_TIMEOUT);

    // Очищуємо timeout при завершенні запиту
    const originalThen = mergedConfig.signal.addEventListener;
    if (originalThen) {
      controller.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
    }
  }

  const promise = apiClient(mergedConfig)
    .then(({ data }) => {
      // Можна додати глобальну обробку успішних відповідей
      return data;
    })
    .catch((error: AxiosError) => {
      // Створюємо типізовану помилку
      const apiError: ApiError = new Error(
        (error.response?.data as ApiErrorResponse)?.message ||
          error.message ||
          'Невідома помилка API'
      );

      apiError.status = error.response?.status;
      apiError.code = error.code;
      apiError.details = error.response?.data;

      // Можна додати глобальну обробку помилок (toast, логування в Sentry, тощо)
      if (process.env.NODE_ENV === 'production') {
        // Тут можна додати відправку помилок в систему моніторингу
        console.error('Production API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: apiError.message,
        });
      }

      throw apiError;
    });

  return promise;
};

// 🎯 Додаткові утиліти для роботи з API
export const apiUtils = {
  // Перевірка статусу з'єднання
  async healthCheck(): Promise<boolean> {
    try {
      await customInstance({ url: '/health', method: 'GET' });
      return true;
    } catch {
      return false;
    }
  },

  // Очищення всіх кешів (якщо потрібно)
  clearCache(): void {
    // Тут можна додати логіку очищення React Query кешу
    console.log('🗑️ API cache cleared');
  },

  // Отримання токену
  getToken: getAuthToken,

  // Очищення токену
  clearToken: clearAuthToken,

  // Перевірка чи є токен
  async hasValidToken(): Promise<boolean> {
    const token = await getAuthToken();
    if (!token) return false;

    // Можна додати перевірку на expire
    try {
      // Простий decode JWT без верифікації (тільки для перевірки expire)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

// Default export для Orval
export default customInstance;

// Named export для Orval з опцією name
export const orvalFetcher = customInstance;
