/**
 * @fileoverview Тонка прослойка для роботи з price-list API
 * Price list - це read-only API для офіційного прайс-листа
 */

import { 
  useListPriceListItems,
  useGetPriceListItemById,
  type ListPriceListItemsParams,
  type PriceListItemInfo 
} from '@/shared/api/generated/serviceItem';
import { CATALOG_DEFAULTS } from '@/features/catalog';

/**
 * Хук для отримання списку елементів прайс-листа
 * з дефолтними параметрами
 */
export const usePriceList = (params?: Partial<ListPriceListItemsParams>) => {
  return useListPriceListItems({
    active: params?.active ?? CATALOG_DEFAULTS.FILTERS.ACTIVE_ONLY,
    categoryCode: params?.categoryCode,
    offset: params?.offset ?? 0,
    limit: params?.limit ?? 100, // Більший ліміт для прайс-листа
  });
};

/**
 * Хук для отримання деталей елемента прайс-листа
 */
export const usePriceListItem = (id: string) => {
  return useGetPriceListItemById(id, {
    query: {
      enabled: !!id,
    }
  });
};

/**
 * Утиліта для пошуку елементів прайс-листа по назві
 * (клієнтська фільтрація)
 */
export const filterPriceListByName = (
  items: PriceListItemInfo[],
  searchQuery: string
): PriceListItemInfo[] => {
  if (!searchQuery) return items;
  
  const query = searchQuery.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(query)
  );
};

/**
 * Утиліта для групування елементів по категоріях
 */
export const groupPriceListByCategory = (
  items: PriceListItemInfo[]
): Record<string, PriceListItemInfo[]> => {
  return items.reduce((acc, item) => {
    if (!acc[item.categoryCode]) {
      acc[item.categoryCode] = [];
    }
    acc[item.categoryCode].push(item);
    return acc;
  }, {} as Record<string, PriceListItemInfo[]>);
};

/**
 * Хук для отримання прайс-листа з групуванням по категоріях
 */
export const usePriceListGrouped = (params?: Partial<ListPriceListItemsParams>) => {
  const query = usePriceList(params);
  
  const grouped = query.data?.priceListItems 
    ? groupPriceListByCategory(query.data.priceListItems)
    : {};
    
  return {
    ...query,
    grouped,
  };
};