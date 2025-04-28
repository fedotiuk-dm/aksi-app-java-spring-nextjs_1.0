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
          return await ItemCharacteristicsService.getStainTypes();
        } catch (error) {
          console.error('Помилка при отриманні типів плям:', error);
          return [];
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
          return await ItemCharacteristicsService.getDefects();
        } catch (error) {
          console.error('Помилка при отриманні дефектів:', error);
          return [];
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
          return await ItemCharacteristicsService.getRisks();
        } catch (error) {
          console.error('Помилка при отриманні ризиків:', error);
          return [];
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
          return await ItemCharacteristicsService.getDefectsAndRisks();
        } catch (error) {
          console.error('Помилка при отриманні дефектів та ризиків:', error);
          return [];
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
