/**
 * @fileoverview Orval fetcher adapter для автогенерованих хуків
 */

import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Базова URL для API
const BASE_URL =
  process.env.NODE_ENV === 'production' ? 'http://localhost/api' : 'http://localhost:8080/api';

// Створюємо axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Додаємо interceptor для авторизації
apiClient.interceptors.request.use((config) => {
  // Тут можна додати логіку для отримання токена
  const token = document?.cookie
    ?.split('; ')
    ?.find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor для обробки помилок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Можна додати логіку logout
      console.warn('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// Default export function для Orval
const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const promise = apiClient({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};

export default customInstance;

// Named export для Orval з опцією name
export const orvalFetcher = customInstance;
