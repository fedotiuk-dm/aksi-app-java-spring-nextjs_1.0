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
  try {
    const mergedConfig: AxiosRequestConfig = {
      ...config,
      ...options,
      // Забезпечуємо, що withCredentials завжди true для cookies
      withCredentials: true,
    };

    const { data } = await apiClient.request<T>(mergedConfig);
    return data;
  } catch (error) {
    // Передаємо помилку далі для обробки Orval
    throw error;
  }
};

// Default export для Orval
export default customInstance;

// Named export для Orval з опцією name
export const orvalFetcher = customInstance;