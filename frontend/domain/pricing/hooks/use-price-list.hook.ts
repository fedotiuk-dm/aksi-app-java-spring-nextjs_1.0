/**
 * Хук для роботи з прайс-листом
 * Надає функціональність для завантаження найменувань та цін
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

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
  } = useQuery<PriceListItemDTO[]>({
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
      .filter((item: PriceListItemDTO) => item.active)
      .map((item: PriceListItemDTO) => item.name || '')
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

  // Новий метод для отримання всіх цін для товару
  const getPriceOptions = useCallback(
    (itemName: string): Array<{ type: string; label: string; price: number; color: string }> => {
      const item = items.find((item: PriceListItemDTO) => item.name === itemName);
      if (!item) return [];

      const options = [];

      // Базова ціна
      if (item.basePrice && item.basePrice > 0) {
        options.push({
          type: 'base',
          label: 'Базова ціна',
          price: item.basePrice,
          color: 'other',
        });
      }

      // Ціна для чорного кольору
      if (item.priceBlack && item.priceBlack > 0 && item.priceBlack !== item.basePrice) {
        options.push({
          type: 'black',
          label: 'Для чорного кольору',
          price: item.priceBlack,
          color: 'black',
        });
      }

      // Ціна для кольорових виробів
      if (item.priceColor && item.priceColor > 0 && item.priceColor !== item.basePrice) {
        options.push({
          type: 'color',
          label: 'Для кольорових виробів',
          price: item.priceColor,
          color: 'color',
        });
      }

      return options;
    },
    [items]
  );

  // Метод для отримання інформації про товар з усіма цінами
  const getItemWithPrices = useCallback(
    (itemName: string) => {
      const item = items.find((item: PriceListItemDTO) => item.name === itemName);
      if (!item) return null;

      const priceOptions = getPriceOptions(itemName);

      return {
        id: item.id || '',
        name: item.name || '',
        unitOfMeasure: item.unitOfMeasure || 'шт',
        basePrice: item.basePrice || 0,
        priceBlack: item.priceBlack,
        priceColor: item.priceColor,
        priceOptions,
        hasMultiplePrices: priceOptions.length > 1,
      };
    },
    [items, getPriceOptions]
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
    getPriceOptions,
    getItemWithPrices,
    refreshItems,

    // Статистика
    stats: {
      total: items.length,
      active: items.filter((item: PriceListItemDTO) => item.active).length,
    },
  };
};
