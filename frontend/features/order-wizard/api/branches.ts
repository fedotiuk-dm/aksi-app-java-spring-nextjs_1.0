import { BranchLocationsApiService, BranchLocationDTO } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

/**
 * Хук для отримання списку філій
 */
export const useBranchLocations = () => {
  return useQuery<BranchLocationDTO[], Error>({
    queryKey: ['branchLocations'],
    queryFn: async () => {
      try {
        // Оскільки API може повертати один об'єкт або масив, перевіряємо і конвертуємо відповідь
        const response = await BranchLocationsApiService.getAllBranchLocations({});
        // Перевіряємо чи відповідь є масивом
        if (Array.isArray(response)) {
          return response;
        }
        // Якщо це один об'єкт, поміщаємо його в масив
        if (response && typeof response === 'object') {
          return [response as BranchLocationDTO];
        }
        // Якщо жоден з варіантів не спрацював, повертаємо порожній масив
        return [];
      } catch (error) {
        console.error('Помилка завантаження філій:', error);
        return [];
      }
    },
  });
};

/**
 * Хук для отримання деталей конкретної філії
 */
export const useBranchLocationDetails = (id: string | undefined) => {
  return useQuery<BranchLocationDTO | null, Error>({
    queryKey: ['branchLocation', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const response = await BranchLocationsApiService.getBranchLocationById({ id });
        return response;
      } catch (error) {
        console.error(`Помилка завантаження філії з id ${id}:`, error);
        return null;
      }
    },
    enabled: !!id,
  });
};
