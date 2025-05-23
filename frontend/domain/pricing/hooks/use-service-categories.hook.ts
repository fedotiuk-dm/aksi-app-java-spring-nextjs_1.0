/**
 * Хук для роботи з категоріями послуг
 * Надає функціональність для завантаження, вибору та роботи з категоріями хімчистки
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PricingApiService } from '@/lib/api/generated';

import type { ServiceCategoryDTO } from '@/lib/api/generated';

const QUERY_KEYS = {
  SERVICE_CATEGORIES: 'serviceCategories',
  ACTIVE_CATEGORIES: 'activeServiceCategories',
} as const;

/**
 * Хук для роботи з категоріями послуг
 */
export const useServiceCategories = () => {
  // Завантаження всіх категорій
  const {
    data: allCategories = [],
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: [QUERY_KEYS.SERVICE_CATEGORIES],
    queryFn: () => PricingApiService.getAllCategories(),
    staleTime: 5 * 60 * 1000, // 5 хвилин
    retry: 3,
  });

  // Завантаження тільки активних категорій
  const {
    data: activeCategories = [],
    isLoading: isLoadingActive,
    error: errorActive,
    refetch: refetchActive,
  } = useQuery({
    queryKey: [QUERY_KEYS.ACTIVE_CATEGORIES],
    queryFn: () => PricingApiService.getActiveCategories(),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // Трансформація для UI
  const categoriesForUI = useMemo(() => {
    return activeCategories.map((category) => ({
      value: category.code || '',
      label: category.name || '',
      description: category.description || '',
      unitOfMeasure: getDefaultUnitOfMeasure(category.code || ''),
      standardProcessingDays: category.standardProcessingDays || 2,
    }));
  }, [activeCategories]);

  // Методи
  const getCategoryByCode = useCallback(
    (code: string): ServiceCategoryDTO | undefined => {
      return activeCategories.find((cat) => cat.code === code);
    },
    [activeCategories]
  );

  const refreshCategories = useCallback(async () => {
    await Promise.all([refetchAll(), refetchActive()]);
  }, [refetchAll, refetchActive]);

  // Статистика
  const stats = useMemo(
    () => ({
      total: allCategories.length,
      active: activeCategories.length,
      inactive: allCategories.length - activeCategories.length,
    }),
    [allCategories.length, activeCategories.length]
  );

  return {
    // Дані
    allCategories,
    activeCategories,
    categoriesForUI,

    // Стан
    isLoading: isLoadingAll || isLoadingActive,
    isLoadingAll,
    isLoadingActive,
    error: errorAll || errorActive,
    hasCategories: activeCategories.length > 0,

    // Методи
    getCategoryByCode,
    refreshCategories,

    // Статистика
    stats,
  };
};

/**
 * Визначення одиниці виміру за замовчуванням на основі коду категорії
 */
function getDefaultUnitOfMeasure(categoryCode: string): string {
  const weightBasedCategories = ['LAUNDRY', 'BULK_CLEANING'];
  return weightBasedCategories.includes(categoryCode) ? 'кг' : 'шт';
}
