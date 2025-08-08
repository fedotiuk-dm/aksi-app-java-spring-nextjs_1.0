'use client';

import axios from 'axios';
import type { AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { transformRequestData, transformResponseData } from './api/orval-transformer';
import { AXIOS_CONFIG, ENABLE_TRANSFORMS } from './api/axios-config';
import { shouldLogDev, onAxiosResponseError } from './api/axios-helpers';

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
  // Автоматичний CSRF: axios сам прочитає cookie та поставить заголовок
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  paramsSerializer: {
    // Для сумісності зі Spring Data (повторювані ключі без індексів)
    indexes: false,
  },
});

function applyRequestTransforms(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (!ENABLE_TRANSFORMS) return config;
  const data = config.data as unknown;
  const isObject = typeof data === 'object' && data !== null;
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  if (!isObject || isFormData) return config;
  config.data = transformRequestData(data, config);
  return config;
}

// Тонкий request-інтерсептор лише для трансформацій
apiClient.interceptors.request.use(applyRequestTransforms);

// Логування запитів у режимі розробки
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use((config) => {
    const url = config.url || '';
    if (shouldLogDev(url)) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  });

  apiClient.interceptors.response.use((response) => {
    const url = response.config.url || '';
    if (shouldLogDev(url)) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  });
}

// Глобальна трансформація даних відповіді (опційно)
apiClient.interceptors.response.use((response) => {
  if (ENABLE_TRANSFORMS) {
    response.data = transformResponseData(response.data, response);
  }
  return response;
});

// Cookie-based authentication не потребує refresh token логіки
// Сесія управляється на сервері і автоматично подовжується

// Обробка помилок відповіді
apiClient.interceptors.response.use((response: AxiosResponse) => response, onAxiosResponseError);

export default apiClient;
