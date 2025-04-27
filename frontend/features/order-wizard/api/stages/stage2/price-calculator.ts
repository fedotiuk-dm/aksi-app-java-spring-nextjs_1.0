import { useQuery, useMutation } from '@tanstack/react-query';
import { PriceCalculatorService } from '@/lib/api';
import type { ModifierDTO, PriceCalculationRequestDTO, PriceCalculationResponseDTO } from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';

/**
 * Хук для роботи з ціновим калькулятором (етап 2.4)
 */
export const usePriceCalculator = () => {
  /**
   * Отримання базової ціни для предмета
   */
  const useBasePrice = (categoryCode: string | undefined, itemName: string | undefined) => {
    return useQuery<PriceCalculationResponseDTO>({
      queryKey: [QUERY_KEYS.PRICE_CALCULATION, 'base', categoryCode, itemName],
      queryFn: async () => {
        if (!categoryCode || !itemName) {
          throw new Error('Категорія та назва предмета обов\'язкові для отримання базової ціни');
        }
        
        try {
          return await PriceCalculatorService.getBasePrice({
            categoryCode,
            itemName,
          });
        } catch (error) {
          console.error('Помилка при отриманні базової ціни:', error);
          throw error;
        }
      },
      enabled: !!categoryCode && !!itemName,
    });
  };

  /**
   * Розрахунок ціни з урахуванням модифікаторів
   */
  const useCalculatePrice = () => {
    return useMutation<
      PriceCalculationResponseDTO,
      Error,
      PriceCalculationRequestDTO
    >({
      mutationFn: async (request: PriceCalculationRequestDTO) => {
        try {
          return await PriceCalculatorService.calculatePrice({
            requestBody: request,
          });
        } catch (error) {
          console.error('Помилка при розрахунку ціни:', error);
          throw error;
        }
      },
    });
  };

  /**
   * Отримання всіх доступних модифікаторів ціни
   */
  const useAllModifiers = () => {
    return useQuery<ModifierDTO[]>({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, 'all'],
      queryFn: async () => {
        try {
          return await PriceCalculatorService.getAllModifiers();
        } catch (error) {
          console.error('Помилка при отриманні модифікаторів ціни:', error);
          return [];
        }
      },
    });
  };

  /**
   * Отримання модифікаторів ціни для конкретної категорії
   */
  const useModifiersForCategory = (categoryCode: string | undefined) => {
    return useQuery<ModifierDTO[]>({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, 'category', categoryCode],
      queryFn: async () => {
        if (!categoryCode) {
          return [];
        }
        
        try {
          return await PriceCalculatorService.getModifiersForCategory({
            categoryCode,
          });
        } catch (error) {
          console.error('Помилка при отриманні модифікаторів для категорії:', error);
          return [];
        }
      },
      enabled: !!categoryCode,
    });
  };



  return {
    useBasePrice,
    useCalculatePrice,
    useAllModifiers,
    useModifiersForCategory,
  };
};
