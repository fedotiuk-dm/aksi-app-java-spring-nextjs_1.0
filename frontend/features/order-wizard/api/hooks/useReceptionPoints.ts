/**
 * Хуки для роботи з API пунктів прийому замовлень
 */
import { useQuery } from '@tanstack/react-query';
import { ReceptionPointsService } from '@/lib/api';

/**
 * Хук для отримання всіх активних пунктів прийому
 */
export const useReceptionPoints = () => {
  return useQuery({
    queryKey: ['receptionPoints'],
    queryFn: async () => {
      const result = await ReceptionPointsService.getActiveReceptionPoints();
      return result;
    },
  });
};

/**
 * Хук для отримання детальної інформації про пункт прийому за ID
 */
export const useReceptionPoint = (receptionPointId?: string) => {
  return useQuery({
    queryKey: ['receptionPoint', receptionPointId],
    queryFn: async () => {
      if (!receptionPointId) {
        throw new Error('Reception point ID is required');
      }
      const result = await ReceptionPointsService.getReceptionPointById({ 
        id: receptionPointId 
      });
      return result;
    },
    enabled: !!receptionPointId,
  });
};
