/**
 * @fileoverview Хук для управління основною інформацією про предмет
 *
 * Відповідальність:
 * - Вибір категорії послуг
 * - Вибір найменування з прайсу
 * - Кількість та одиниця виміру
 */

import { useState, useCallback, useMemo } from 'react';

import {
  useGetAllActiveCategories,
  useGetItemsByCategory,
} from '@/shared/api/generated/full/aksiApi';

import type { ItemBasicInfo, UseItemBasicInfoReturn } from './types';
import type {
  ServiceCategoryDTO,
  PriceListItemDTO,
} from '@/shared/api/generated/full/aksiApi.schemas';

/**
 * Хук для управління основною інформацією про предмет
 *
 * @example
 * ```tsx
 * const {
 *   basicInfo,
 *   categories,
 *   priceListItems,
 *   setCategory,
 *   setPriceListItem
 * } = useItemBasicInfo();
 *
 * // Вибрати категорію
 * setCategory(selectedCategory);
 *
 * // Вибрати предмет
 * setPriceListItem(selectedItem);
 * ```
 */
export function useItemBasicInfo(): UseItemBasicInfoReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [basicInfo, setBasicInfo] = useState<ItemBasicInfo>({
    quantity: 1,
    unitOfMeasure: 'pieces',
  });

  const [error, setError] = useState<string | null>(null);

  // =====================================
  // API запити
  // =====================================

  // Активні категорії послуг
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useGetAllActiveCategories({
    query: {
      staleTime: 10 * 60 * 1000, // 10 хвилин кеш для категорій
      gcTime: 30 * 60 * 1000, // 30 хвилин в memory
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  });

  // Прайс-лист для вибраної категорії
  const {
    data: priceListData,
    isLoading: isLoadingPriceList,
    error: priceListError,
  } = useGetItemsByCategory(
    basicInfo.category?.id ?? '', // categoryId
    {
      query: {
        enabled: !!basicInfo.category?.id, // Виконувати запит тільки коли категорія вибрана
        staleTime: 5 * 60 * 1000, // 5 хвилин кеш для прайс-листу
        gcTime: 15 * 60 * 1000, // 15 хвилин в memory
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    }
  );

  // =====================================
  // Обробка даних
  // =====================================

  const categories = useMemo(() => {
    if (!categoriesData) return [];
    // API повертає масив ServiceCategoryDTO
    return Array.isArray(categoriesData) ? categoriesData : [categoriesData];
  }, [categoriesData]);

  const priceListItems = useMemo(() => {
    if (!priceListData) return [];
    // API повертає масив PriceListItemDTO
    return Array.isArray(priceListData) ? priceListData : [priceListData];
  }, [priceListData]);

  // =====================================
  // Обробка помилок
  // =====================================

  useMemo(() => {
    if (categoriesError) {
      setError('Помилка завантаження категорій послуг');
    } else if (priceListError) {
      setError('Помилка завантаження прайс-листу');
    } else {
      setError(null);
    }
  }, [categoriesError, priceListError]);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Встановити категорію послуг
   */
  const setCategory = useCallback((category: ServiceCategoryDTO) => {
    setBasicInfo((prev) => ({
      ...prev,
      category,
      // Очищаємо вибраний предмет при зміні категорії
      priceListItem: undefined,
    }));
  }, []);

  /**
   * Встановити предмет з прайс-листу
   */
  const setPriceListItem = useCallback((priceListItem: PriceListItemDTO) => {
    setBasicInfo((prev) => ({
      ...prev,
      priceListItem,
      // Автоматично встановлюємо одиницю виміру з прайсу
      unitOfMeasure: priceListItem.unitOfMeasure === 'KG' ? 'kg' : 'pieces',
    }));
  }, []);

  /**
   * Встановити кількість
   */
  const setQuantity = useCallback((quantity: number) => {
    if (quantity > 0) {
      setBasicInfo((prev) => ({ ...prev, quantity }));
    }
  }, []);

  /**
   * Встановити одиницю виміру
   */
  const setUnitOfMeasure = useCallback((unitOfMeasure: 'pieces' | 'kg') => {
    setBasicInfo((prev) => ({ ...prev, unitOfMeasure }));
  }, []);

  /**
   * Очистити всю інформацію
   */
  const clearBasicInfo = useCallback(() => {
    setBasicInfo({
      quantity: 1,
      unitOfMeasure: 'pieces',
    });
    setError(null);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    basicInfo,
    categories,
    priceListItems,
    isLoadingCategories,
    isLoadingPriceList,
    error,

    // Дії
    setCategory,
    setPriceListItem,
    setQuantity,
    setUnitOfMeasure,
    clearBasicInfo,
  };
}
