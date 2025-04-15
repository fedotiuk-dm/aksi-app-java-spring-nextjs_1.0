'use client';

import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { authTokens } from '@/features/auth/api/authApi';

// Отримуємо базовий URL API з змінних середовища
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

console.log('[axios.ts] Ініціалізація з API URL:', baseURL); // Логування для відстеження URL

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
      config.baseURL,
      config.data
    );

    const token = authTokens.getToken();
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
    console.error('API Error:', error.message, error.config?.url);

    const originalRequest = error.config;

    // Доступ до localStorage лише на клієнті
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // Обробка 401 Unauthorized помилки (закінчився термін дії токена)
    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem('refreshToken');

      // Якщо немає токена оновлення або вже йде процес оновлення
      if (!refreshToken || isRefreshing) {
        // Перевіряємо, чи це не запит на оновлення токена
        if (originalRequest.url?.includes('refresh-token')) {
          // Виходимо з системи, якщо refresh token невалідний
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
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
        const response = await apiClient.post('/auth/refresh-token', {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Оновлюємо токени в localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Оновлюємо заголовок оригінального запиту та запитів у черзі
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Виконуємо запити з черги з новим токеном
        failedQueue.forEach((req) => {
          if (req.originalRequest.headers) {
            req.originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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

        // Очищаємо дані автентифікації та перенаправляємо на сторінку входу
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Перевіряємо статус 403 (Forbidden)
    if (error.response?.status === 403) {
      // Зберігаємо поточний URL для повернення після логіну
      localStorage.setItem('redirectUrl', window.location.pathname);
      // Перенаправляємо на сторінку логіну
      window.location.href = '/login';
    }

    // Обробка інших помилок
    if (error.response) {
      // Сервер відповів з кодом помилки
      switch (error.response.status) {
        case 404:
          // Ресурс не знайдено
          console.error('Ресурс не знайдено');
          break;
        case 500:
          // Внутрішня помилка сервера
          console.error('Помилка сервера');
          break;
        default:
          console.error(`Помилка з кодом ${error.response.status}`);
      }
    } else if (error.request) {
      // Запит був зроблений, але відповіді немає (мережева помилка)
      console.error('Немає відповіді від сервера');
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
