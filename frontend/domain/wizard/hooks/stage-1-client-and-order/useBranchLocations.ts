/**
 * @fileoverview Хук для роботи з філіями
 *
 * Відповідальність:
 * - Завантаження списку філій
 * - Фільтрація активних філій
 * - Пошук філії за ID або кодом
 * - Кешування даних
 */

import { useMemo, useCallback } from 'react';

// Orval згенеровані хуки
import {
  useGetAllBranchLocations,
  useGetBranchLocationById,
  useGetBranchLocationByCode,
} from '@/shared/api/generated/branch/aksiApi';

// Orval згенеровані типи
import type { UseBranchLocationsReturn } from './types';
import type { BranchLocationDTO } from '@/shared/api/generated/branch/aksiApi.schemas';

// Типи

/**
 * Хук для роботи з філіями
 *
 * @example
 * ```tsx
 * const {
 *   locations,
 *   activeLocations,
 *   isLoading,
 *   error,
 *   getLocationById,
 *   refetch
 * } = useBranchLocations();
 *
 * // Отримати філію за ID
 * const branch = getLocationById('branch-id');
 *
 * // Перезавантажити дані
 * await refetch();
 * ```
 */
export function useBranchLocations(): UseBranchLocationsReturn {
  // =====================================
  // Orval хук для завантаження всіх філій
  // =====================================

  const {
    data: branchResponse,
    isLoading,
    error: apiError,
    refetch: refetchBranches,
  } = useGetAllBranchLocations(
    { active: undefined }, // Завантажуємо всі філії
    {
      query: {
        staleTime: 10 * 60 * 1000, // 10 хвилин кеш
        gcTime: 30 * 60 * 1000, // 30 хвилин в кеші
        refetchOnWindowFocus: false, // Не перезавантажувати при фокусі
      },
    }
  );

  // =====================================
  // Обробка даних
  // =====================================

  // Всі філії
  const locations = useMemo(() => {
    return Array.isArray(branchResponse) ? (branchResponse as BranchLocationDTO[]) : [];
  }, [branchResponse]);

  // Тільки активні філії
  const activeLocations = useMemo(() => {
    return locations.filter((location: BranchLocationDTO) => location.active === true);
  }, [locations]);

  // Помилка
  const error = useMemo(() => {
    return apiError ? 'Помилка завантаження філій' : null;
  }, [apiError]);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Перезавантажити список філій
   */
  const refetch = useCallback(async () => {
    try {
      await refetchBranches();
    } catch (err) {
      console.error('Error refetching branch locations:', err);
    }
  }, [refetchBranches]);

  /**
   * Отримати філію за ID
   */
  const getLocationById = useCallback(
    (id: string): BranchLocationDTO | null => {
      return locations.find((location: BranchLocationDTO) => location.id === id) || null;
    },
    [locations]
  );

  /**
   * Отримати філію за кодом
   */
  const getLocationByCode = useCallback(
    (code: string): BranchLocationDTO | null => {
      return locations.find((location: BranchLocationDTO) => location.code === code) || null;
    },
    [locations]
  );

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    locations,
    isLoading,
    error,
    activeLocations,

    // Дії
    refetch,
    getLocationById,
    getLocationByCode,
  };
}

/**
 * Хук для отримання конкретної філії за ID
 *
 * @param id - ID філії
 * @example
 * ```tsx
 * const {
 *   location,
 *   isLoading,
 *   error
 * } = useBranchLocationById('branch-id');
 * ```
 */
export function useBranchLocationById(id: string) {
  return useGetBranchLocationById(id, {
    query: {
      enabled: !!id, // Виконувати запит тільки якщо є ID
      staleTime: 10 * 60 * 1000, // 10 хвилин кеш
      gcTime: 30 * 60 * 1000, // 30 хвилин в кеші
    },
  });
}

/**
 * Хук для отримання конкретної філії за кодом
 *
 * @param code - Код філії
 * @example
 * ```tsx
 * const {
 *   location,
 *   isLoading,
 *   error
 * } = useBranchLocationByCode('MAIN');
 * ```
 */
export function useBranchLocationByCode(code: string) {
  return useGetBranchLocationByCode(code, {
    query: {
      enabled: !!code, // Виконувати запит тільки якщо є код
      staleTime: 10 * 60 * 1000, // 10 хвилин кеш
      gcTime: 30 * 60 * 1000, // 30 хвилин в кеші
    },
  });
}
