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
const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const mergedConfig = {
    ...config,
    ...options,
  };

  return apiClient(mergedConfig).then(({ data }) => data);
};

// Default export для Orval
export default customInstance;

// Named export для Orval з опцією name
export const orvalFetcher = customInstance;