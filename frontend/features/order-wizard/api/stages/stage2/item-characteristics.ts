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
      queryKey: [QUERY_KEYS.COLORS],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getColors();
          return response || [];
        } catch (error) {
          console.error('Помилка при отриманні кольорів:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання списку матеріалів з можливістю фільтрації за категорією
   * @param category - ідентифікатор категорії (опціонально)
   */
  const useMaterials = (category?: string) => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.MATERIALS, category],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getMaterials({
            category,
          });
          return response || [];
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
          const response = await ItemCharacteristicsService.getDefects();
          return response || [];
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
          const response =
            await ItemCharacteristicsService.getDefectsAndRisks();
          return response || [];
        } catch (error) {
          console.error('Помилка при отриманні дефектів та ризиків:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання типів наповнювачів для предметів
   */
  const useFillerTypes = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.FILLER_TYPES],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getFillerTypes();
          return response || [];
        } catch (error) {
          console.error('Помилка при отриманні типів наповнювачів:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Отримання ступенів зносу для предметів
   */
  const useWearDegrees = () => {
    return useQuery<string[]>({
      queryKey: [QUERY_KEYS.WEAR_DEGREES],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getWearDegrees();
          return response || [];
        } catch (error) {
          console.error('Помилка при отриманні ступенів зносу:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 60, // Кеш на годину, рідко змінюються
    });
  };

  /**
   * Перевірка, чи потрібен наповнювач для вибраної категорії
   * @param categoryId - ідентифікатор категорії (опціонально)
   */
  const useIsFillerRequired = (categoryId?: string) => {
    return useQuery<boolean>({
      queryKey: [QUERY_KEYS.IS_FILLER_REQUIRED, categoryId],
      queryFn: async () => {
        if (!categoryId) return false;

        try {
          // TODO: Замінити реалізацію на виклик відповідного API

          // Повертаємо значення на основі категорії
          const categoriesWithFiller = [
            'OUTERWEAR',
            'BLANKETS',
            'PILLOWS',
            'BEDDING',
            'QUILTED',
          ];
          return categoriesWithFiller.includes(categoryId);
        } catch (error) {
          console.error(
            'Помилка при перевірці необхідності наповнювача:',
            error
          );
          return false;
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
    useFillerTypes,
    useWearDegrees,
    useIsFillerRequired,
  };
};

// Експортуємо функцію-хук, яку можна викликати в компонентах
export default useItemCharacteristics;
