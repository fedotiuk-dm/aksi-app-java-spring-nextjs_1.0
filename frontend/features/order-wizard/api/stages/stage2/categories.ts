import { useQuery } from '@tanstack/react-query';
import {
  ServiceCategoryService,
  PriceListService,
  UnitOfMeasureService,
} from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';
import type {
  ServiceCategoryDTO as ServiceCategoryDTOBase,
  PriceListItemDTO as PriceListItemDTOBase,
} from '@/lib/api';

// Реекспорт типів для використання в UI
export type ServiceCategoryDTO = ServiceCategoryDTOBase;
export type PriceListItemDTO = PriceListItemDTOBase;

/**
 * Хук для роботи з категоріями послуг та найменуваннями предметів (етап 2.1)
 */
export const useServiceCategories = () => {
  /**
   * Отримання списку всіх активних категорій послуг
   */
  const useActiveCategories = () => {
    return useQuery<ServiceCategoryDTO[]>({
      queryKey: [QUERY_KEYS.CATEGORIES],
      queryFn: async () => {
        try {
          return await ServiceCategoryService.getAllActiveCategories();
        } catch (error) {
          console.error('Помилка при отриманні категорій послуг:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, оскільки категорії рідко змінюються
    });
  };

  /**
   * Отримання найменувань предметів для конкретної категорії
   */
  const useItemNames = (categoryId: string | null) => {
    return useQuery<PriceListItemDTO[]>({
      queryKey: [QUERY_KEYS.ITEM_NAMES, categoryId],
      queryFn: async () => {
        if (!categoryId) {
          return [];
        }

        try {
          const items = await PriceListService.getItemsByCategory({
            categoryId: categoryId,
          });
          // Додаємо логування для аналізу отриманих даних
          console.log('Отримані дані з API для категорії:', categoryId);
          console.log('Кількість товарів:', items.length);
          if (items.length > 0) {
            console.log(
              'Приклад першого товару:',
              JSON.stringify(items[0], null, 2)
            );
            // Перевіряємо поля priceBlack та priceColor
            const itemsWithBlackPrice = items.filter(
              (item) =>
                item.priceBlack !== undefined && item.priceBlack !== null
            );
            const itemsWithColorPrice = items.filter(
              (item) =>
                item.priceColor !== undefined && item.priceColor !== null
            );
            console.log('Товарів з priceBlack:', itemsWithBlackPrice.length);
            console.log('Товарів з priceColor:', itemsWithColorPrice.length);
          }
          return items;
        } catch (error) {
          console.error('Помилка при отриманні найменувань предметів:', error);
          return [];
        }
      },
      enabled: !!categoryId,
      staleTime: 1000 * 60 * 30, // Кеш на 30 хвилин
    });
  };

  /**
   * Отримання доступних одиниць виміру для категорії
   */
  const useUnitsOfMeasure = (categoryId: string | null) => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.UNITS_OF_MEASURE, categoryId],
      queryFn: async () => {
        if (!categoryId) {
          return [];
        }

        try {
          return await UnitOfMeasureService.getAvailableUnitsForCategory({
            categoryId,
          });
        } catch (error) {
          console.error('Помилка при отриманні одиниць виміру:', error);
          return [];
        }
      },
      enabled: !!categoryId,
      staleTime: 1000 * 60 * 60, // Кеш на годину
    });
  };

  /**
   * Перевірка підтримки одиниці виміру для предмета
   */
  const useCheckUnitSupport = (
    categoryId: string | null,
    itemName: string | null,
    unitOfMeasure: string | null
  ) => {
    return useQuery<boolean>({
      queryKey: [QUERY_KEYS.UNIT_SUPPORT, categoryId, itemName, unitOfMeasure],
      queryFn: async () => {
        if (!categoryId || !itemName || !unitOfMeasure) {
          return false;
        }

        try {
          return await UnitOfMeasureService.isUnitSupportedForItem({
            categoryId,
            itemName,
            unitOfMeasure,
          });
        } catch (error) {
          console.error(
            'Помилка при перевірці підтримки одиниці виміру:',
            error
          );
          return false;
        }
      },
      enabled: !!categoryId && !!itemName && !!unitOfMeasure,
    });
  };

  return {
    useActiveCategories,
    useItemNames,
    useUnitsOfMeasure,
    useCheckUnitSupport,
  };
};
