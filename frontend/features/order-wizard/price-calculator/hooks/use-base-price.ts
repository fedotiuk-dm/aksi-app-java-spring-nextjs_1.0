import { useQuery } from '@tanstack/react-query';
import { PriceCalculationService } from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';

export const useBasePrice = (
  categoryCode: string | undefined,
  itemName: string | undefined
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BASE_PRICE, categoryCode, itemName],
    queryFn: async () => {
      if (!categoryCode || !itemName) {
        throw new Error(
          "Категорія та назва предмета обов'язкові для отримання базової ціни"
        );
      }

      try {
        return await PriceCalculationService.getBasePrice({
          categoryCode,
          itemName,
        });
      } catch (error) {
        console.error('Помилка при отриманні базової ціни:', error);
        throw error;
      }
    },
    enabled: Boolean(categoryCode && itemName),
  });
};
