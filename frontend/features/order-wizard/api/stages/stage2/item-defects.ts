import { useQuery } from '@tanstack/react-query';
import { ItemCharacteristicsService } from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';

/**
 * Хук для роботи з плямами та дефектами предметів (етап 2.3)
 */
export const useItemDefects = () => {
  /**
   * Отримання типів плям для предметів
   */
  const useStainTypes = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.DEFECTS, 'stainTypes'],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getStainTypes();
          console.log('API (успіх): Отримані типи плям:', response);
          return response;
        } catch (error) {
          console.error('API (помилка): Не вдалося отримати типи плям:', error);
          // Якщо API недоступне, повертаємо базові типи плям для можливості продовжити роботу
          return [
            'GREASE',
            'BLOOD',
            'PROTEIN',
            'WINE',
            'COFFEE',
            'GRASS',
            'INK',
            'COSMETICS',
            'OTHER',
          ];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання дефектів для предметів
   */
  const useDefects = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.DEFECTS, 'defects'],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getDefects();
          console.log('API (успіх): Отримані дефекти:', response);
          return response;
        } catch (error) {
          console.error('API (помилка): Не вдалося отримати дефекти:', error);
          // Якщо API недоступне, повертаємо базові типи дефектів
          return ['WORN', 'TORN', 'MISSING_HARDWARE', 'DAMAGED_HARDWARE'];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання ризиків для предметів
   */
  const useRisks = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.DEFECTS, 'risks'],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getRisks();
          console.log('API (успіх): Отримані ризики:', response);
          return response;
        } catch (error) {
          console.error('API (помилка): Не вдалося отримати ризики:', error);
          // Якщо API недоступне, повертаємо базові типи ризиків
          return ['COLOR_CHANGE_RISK', 'DEFORMATION_RISK', 'NO_GUARANTEE'];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання дефектів та ризиків разом
   */
  const useDefectsAndRisks = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.DEFECTS, 'defectsAndRisks'],
      queryFn: async () => {
        try {
          const response =
            await ItemCharacteristicsService.getDefectsAndRisks();
          console.log('API (успіх): Отримані дефекти та ризики:', response);
          return response;
        } catch (error) {
          console.error(
            'API (помилка): Не вдалося отримати дефекти та ризики:',
            error
          );
          // Якщо API недоступне, повертаємо об'єднані базові типи
          return [
            'WORN',
            'TORN',
            'MISSING_HARDWARE',
            'DAMAGED_HARDWARE',
            'COLOR_CHANGE_RISK',
            'DEFORMATION_RISK',
            'NO_GUARANTEE',
          ];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  return {
    useStainTypes,
    useDefects,
    useRisks,
    useDefectsAndRisks,
  };
};

export default useItemDefects;
