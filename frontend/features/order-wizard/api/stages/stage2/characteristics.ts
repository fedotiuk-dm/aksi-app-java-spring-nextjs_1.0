import { useQuery } from '@tanstack/react-query';
import { ItemCharacteristicsService } from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';

/**
 * Хук для роботи з характеристиками предметів (етап 2.2)
 */
export const useItemCharacteristics = () => {
  /**
   * Отримання списку кольорів
   */
  const useColors = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.CHARACTERISTICS, 'colors'],
      queryFn: async () => {
        try {
          return await ItemCharacteristicsService.getColors();
        } catch (error) {
          console.error('Помилка при отриманні кольорів:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання списку матеріалів
   */
  const useMaterials = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.CHARACTERISTICS, 'materials'],
      queryFn: async () => {
        try {
          // Використовуємо getMaterials без вказання категорії,
          // щоб отримати всі матеріали
          return await ItemCharacteristicsService.getMaterials({});
        } catch (error) {
          console.error('Помилка при отриманні матеріалів:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання списку дефектів
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
   * Отримання списку дефектів та ризиків
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
    useColors,
    useMaterials,
    useDefects,
    useDefectsAndRisks,
  };
};
