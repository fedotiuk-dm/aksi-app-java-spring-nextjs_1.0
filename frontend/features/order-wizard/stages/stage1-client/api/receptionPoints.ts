import { useQuery } from '@tanstack/react-query';
import { ReceptionPointDTO, ReceptionPointsService } from '@/lib/api';

/**
 * Хук для отримання списку активних пунктів прийому
 */
export const useReceptionPoints = () => {
  return useQuery<ReceptionPointDTO[]>({
    queryKey: ['receptionPoints'],
    queryFn: async () => {
      try {
        const points = await ReceptionPointsService.getActiveReceptionPoints();
        return points;
      } catch (error) {
        console.error('Error fetching reception points:', error);
        throw error;
      }
    },
  });
};
