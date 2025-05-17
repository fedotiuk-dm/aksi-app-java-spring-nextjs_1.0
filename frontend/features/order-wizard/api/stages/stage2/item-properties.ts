import { useQuery } from '@tanstack/react-query';
import { ItemCharacteristicsService } from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';
import { MaterialType } from '@/features/order-wizard/model/schema/item-properties.schema';

/**
 * Хук для роботи з характеристиками предметів (підетап 2.2)
 */
export const useItemProperties = () => {
  /**
   * Отримання матеріалів для категорії
   * @param categoryId - ID категорії
   */
  const useMaterialsForCategory = (categoryId?: string) => {
    return useQuery<MaterialType[]>({
      queryKey: [QUERY_KEYS.MATERIALS, categoryId],
      queryFn: async () => {
        try {
          if (!categoryId) {
            console.log('Категорія не визначена, повертаємо всі матеріали');
            return Object.values(MaterialType);
          }

          // Виклик OpenAPI для отримання матеріалів для категорії
          const response = await ItemCharacteristicsService.getMaterials({
            category: categoryId,
          });

          if (!response || response.length === 0) {
            console.log(
              'API повернуло порожній список матеріалів для категорії',
              categoryId
            );
            return Object.values(MaterialType);
          }

          console.log('API: Отримані матеріали для категорії:', response);

          // Конвертуємо отримані рядки в enum MaterialType
          const materials = response
            .filter((material) => isValidMaterialType(material))
            .map((material) => material as MaterialType);

          // Якщо API не повернуло жодного валідного матеріалу, повертаємо всі можливі
          if (materials.length === 0) {
            console.log(
              'Жоден з отриманих матеріалів не відповідає enum MaterialType'
            );
            return Object.values(MaterialType);
          }

          return materials;
        } catch (error) {
          console.error(
            'API: Не вдалося отримати матеріали для категорії:',
            error
          );
          // У випадку помилки повертаємо всі матеріали
          return Object.values(MaterialType);
        }
      },
      staleTime: 1000 * 60 * 10, // Кеш на 10 хвилин
      enabled: !!categoryId, // Запускаємо запит тільки якщо є categoryId
    });
  };

  /**
   * Перевірка, чи отримане значення відповідає enum MaterialType
   */
  const isValidMaterialType = (value: string): value is MaterialType => {
    return Object.values(MaterialType).includes(value as MaterialType);
  };

  /**
   * Отримання кольорів для категорії
   */
  const useColorsForCategory = (categoryId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.COLORS, categoryId],
      queryFn: async () => {
        try {
          // Виклик API для отримання кольорів
          const response = await ItemCharacteristicsService.getColors();

          if (!response) {
            console.log('API повернуло порожній список кольорів');
            return [];
          }

          console.log('API: Отримані кольори:', response);
          return response;
        } catch (error) {
          console.error('API: Не вдалося отримати кольори:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 10, // Кеш на 10 хвилин
    });
  };

  /**
   * Отримання типів наповнювачів
   */
  const useFillerTypes = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.FILLER_TYPES],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getFillerTypes();

          if (!response) {
            console.log('API повернуло порожній список типів наповнювачів');
            return [];
          }

          console.log('API: Отримані типи наповнювачів:', response);
          return response;
        } catch (error) {
          console.error('API: Не вдалося отримати типи наповнювачів:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 10, // Кеш на 10 хвилин
    });
  };

  /**
   * Отримання ступенів зносу
   */
  const useWearDegrees = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.WEAR_DEGREES],
      queryFn: async () => {
        try {
          const response = await ItemCharacteristicsService.getWearDegrees();

          if (!response) {
            console.log('API повернуло порожній список ступенів зносу');
            return [];
          }

          console.log('API: Отримані ступені зносу:', response);
          return response;
        } catch (error) {
          console.error('API: Не вдалося отримати ступені зносу:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 10, // Кеш на 10 хвилин
    });
  };

  /**
   * Перевірка, чи потрібен наповнювач для категорії
   */
  const useIsFillerRequired = (categoryId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.IS_FILLER_REQUIRED, categoryId],
      queryFn: async () => {
        if (!categoryId) return false;

        try {
          // У майбутньому тут може бути API запит
          // Наразі реалізовано як проста перевірка категорії
          const fillerCategories = [
            'OUTERWEAR', // Верхній одяг
            'BEDDING', // Постільна білизна
            'QUILTED', // Стьобані вироби
            'PILLOWS', // Подушки
            'BLANKETS', // Ковдри
          ];

          return (
            fillerCategories.includes(categoryId.toString()) ||
            categoryId.toString().includes('FILL')
          );
        } catch (error) {
          console.error(
            'Помилка при перевірці необхідності наповнювача:',
            error
          );
          return false;
        }
      },
      staleTime: 1000 * 60 * 10, // Кеш на 10 хвилин
      enabled: !!categoryId,
    });
  };

  return {
    useMaterialsForCategory,
    useColorsForCategory,
    useFillerTypes,
    useWearDegrees,
    useIsFillerRequired,
  };
};

export default useItemProperties;
