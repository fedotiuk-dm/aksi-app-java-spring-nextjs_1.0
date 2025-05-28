/**
 * @fileoverview Хук для основної інформації про предмет (крок 2.1)
 * @module domain/wizard/hooks/stage-2
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { BasicInfoService } from '../../services/stage-2-item-management';
import { useWizardStore } from '../../store';

/**
 * Хук для основної інформації про предмет
 * 📋 Композиція: TanStack Query + Zustand + BasicInfoService
 */
export const useBasicItemInfo = () => {
  // 🏪 Zustand - глобальний стан
  const { addError } = useWizardStore();

  // ⚙️ Сервіс
  const basicInfoService = useMemo(() => new BasicInfoService(), []);

  // 📋 Завантаження категорій послуг
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['service-categories'],
    queryFn: () => basicInfoService.getCategories(),
    staleTime: 3600000, // 1 година кеш
    gcTime: 7200000, // 2 години в кеші
  });

  // 📋 Завантаження найменувань для обраної категорії
  const {
    data: itemNames = [],
    isLoading: isLoadingItemNames,
    error: itemNamesError,
  } = useQuery({
    queryKey: ['item-names'],
    queryFn: () => basicInfoService.getItemsByCategory(''),
    enabled: false, // Буде активовано при виборі категорії
    staleTime: 600000, // 10 хвилин кеш
    gcTime: 1800000, // 30 хвилин в кеші
  });

  // 🔍 Методи пошуку та фільтрації
  const searchCategories = useCallback(
    (searchTerm: string) => {
      return categories.filter((category: any) =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [categories]
  );

  const getUnitsForCategory = useCallback(
    (categoryId: string) => {
      return basicInfoService.getUnitsForCategory(categoryId);
    },
    [basicInfoService]
  );

  return {
    // 📋 Дані
    categories,
    itemNames,

    // 🔄 Стани завантаження
    isLoadingCategories,
    isLoadingItemNames,
    categoriesError,
    itemNamesError,

    // 🔍 Методи
    searchCategories,
    getUnitsForCategory,
  };
};
