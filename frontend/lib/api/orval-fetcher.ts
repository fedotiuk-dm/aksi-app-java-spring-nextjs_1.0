/**
 * @fileoverview Orval fetcher що використовує основний axios клієнт
 * 
 * Це проста обгортка для нашого основного axios клієнту з HttpOnly cookies
 */

import { apiClient } from '../axios';
import type { AxiosRequestConfig } from 'axios';

/**
 * Custom instance для Orval
 * Використовує наш налаштований axios клієнт з HttpOnly cookies
 */
const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const mergedConfig: AxiosRequestConfig = {
    ...config,
    ...options,
    // Забезпечуємо, що withCredentials завжди true для cookies
    withCredentials: true,
  };

  // Для PDF та інших blob запитів встановлюємо правильний Accept заголовок
  if (mergedConfig.responseType === 'blob') {
    mergedConfig.headers = {
      ...mergedConfig.headers,
      Accept: 'application/pdf,application/octet-stream,*/*',
    };
  }

  // Просто повертаємо результат - всі помилки обробляються в axios interceptors
  const { data } = await apiClient.request<T>(mergedConfig);
  return data;
};

// Default export для Orval
export default customInstance;

// Named export для Orval з опцією name
export const orvalFetcher = customInstance;