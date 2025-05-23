/**
 * Хук для роботи з прайс-листом
 * Надає функціональність для завантаження найменувань та цін
 */

import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PricingApiService } from '@/lib/api/generated';

import type { PriceListItemDTO } from '@/lib/api/generated';

const QUERY_KEYS = {
  PRICE_LIST_ITEMS: 'priceListItems',
  BASE_PRICE: 'basePrice',
} as const;

/**
 * Хук для роботи з прайс-листом
 */
export const usePriceList = (categoryCode?: string) => {
  // Завантаження предметів для категорії
  const {
    data: items = [],
    isLoading: isLoadingItems,
    error: errorItems,
    refetch: refetchItems,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRICE_LIST_ITEMS, categoryCode],
    queryFn: () =>
      categoryCode
        ? PricingApiService.getItemsByCategoryCode({ categoryCode })
        : Promise.resolve([]),
    enabled: Boolean(categoryCode),
    staleTime: 10 * 60 * 1000, // 10 хвилин
    retry: 3,
  });

  // Трансформація найменувань для Autocomplete
  const itemNames = useMemo(() => {
    return items
      .filter((item) => item.active)
      .map((item) => item.name || '')
      .filter(Boolean);
  }, [items]);

  // Методи
  const getItemByName = useCallback(
    (name: string): PriceListItemDTO | undefined => {
      return items.find((item) => item.name === name);
    },
    [items]
  );

  const getBasePrice = useCallback(
    async (itemName: string, color: string = 'other'): Promise<number> => {
      if (!categoryCode || !itemName) return 0;

      try {
        return await PricingApiService.getBasePrice({
          categoryCode,
          itemName,
          color,
        });
      } catch (error) {
        console.error('Помилка отримання базової ціни:', error);
        return 0;
      }
    },
    [categoryCode]
  );

  const refreshItems = useCallback(() => {
    return refetchItems();
  }, [refetchItems]);

  return {
    // Дані
    items,
    itemNames,

    // Стан
    isLoading: isLoadingItems,
    error: errorItems,
    hasItems: items.length > 0,

    // Методи
    getItemByName,
    getBasePrice,
    refreshItems,

    // Статистика
    stats: {
      total: items.length,
      active: items.filter((item) => item.active).length,
    },
  };
};
