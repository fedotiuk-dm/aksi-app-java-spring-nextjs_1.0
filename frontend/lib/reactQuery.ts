'use client';

import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

/**
 * Конфігурація за замовчуванням для React Query
 */
const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Не оновлювати при фокусі на вікні
      refetchOnWindowFocus: false,

      // Кількість спроб при помилці запиту
      retry: 1,

      // Час в мілісекундах, протягом якого дані вважаються "свіжими"
      staleTime: 5 * 60 * 1000, // 5 хвилин

      // Кешувати дані після відмонтування компонента (garbage collection time)
      gcTime: 10 * 60 * 1000, // 10 хвилин
    },
    mutations: {
      // Не повторювати мутації при помилках
      retry: false,
    },
  },
};

/**
 * Глобальний екземпляр QueryClient для використання в провайдері
 */
export const queryClient = new QueryClient(defaultQueryClientConfig);

/**
 * Функція для створення нового екземпляру QueryClient з тими ж налаштуваннями
 * Використовується при необхідності створення окремого екземпляру для кожного запиту
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient(defaultQueryClientConfig);
};
