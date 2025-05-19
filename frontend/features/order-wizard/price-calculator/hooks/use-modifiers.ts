import { useQuery } from '@tanstack/react-query';
import { PriceCalculationService } from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';
import { mapModifiersFromApi } from '../utils/mapper';
import { PriceModifier } from '../types';

export const useAllModifiers = () => {
  return useQuery<PriceModifier[]>({
    queryKey: [QUERY_KEYS.ALL_MODIFIERS],
    queryFn: async () => {
      try {
        const response = await PriceCalculationService.getAllModifiers();
        return mapModifiersFromApi(response);
      } catch (error) {
        console.error('Помилка при отриманні всіх модифікаторів:', error);
        throw error;
      }
    },
  });
};

export const useModifiersForCategory = (categoryCode?: string) => {
  return useQuery<PriceModifier[]>({
    queryKey: [QUERY_KEYS.CATEGORY_MODIFIERS, categoryCode],
    queryFn: async () => {
      if (!categoryCode) {
        throw new Error(
          "Код категорії обов'язковий для отримання модифікаторів"
        );
      }

      try {
        const response = await PriceCalculationService.getModifiersForCategory({
          categoryCode,
        });
        return mapModifiersFromApi(response);
      } catch (error) {
        console.error('Помилка при отриманні модифікаторів категорії:', error);
        throw error;
      }
    },
    enabled: Boolean(categoryCode),
  });
};

export const useModifiersForItem = (
  categoryCode?: string,
  itemName?: string
) => {
  return useQuery<PriceModifier[]>({
    queryKey: [QUERY_KEYS.ITEM_MODIFIERS, categoryCode, itemName],
    queryFn: async () => {
      if (!categoryCode || !itemName) {
        throw new Error(
          "Код категорії та назва предмета обов'язкові для отримання модифікаторів"
        );
      }

      try {
        const response = await PriceCalculationService.getModifiersForItem({
          categoryCode,
          itemName,
        });
        return mapModifiersFromApi(response);
      } catch (error) {
        console.error('Помилка при отриманні модифікаторів предмета:', error);
        throw error;
      }
    },
    enabled: Boolean(categoryCode && itemName),
  });
};
