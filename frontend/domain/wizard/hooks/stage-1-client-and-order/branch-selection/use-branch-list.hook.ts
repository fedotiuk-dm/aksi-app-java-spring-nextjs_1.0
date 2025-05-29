import { useQuery } from '@tanstack/react-query';

import { getAllBranchLocations } from '@/shared/api/generated/branch';

import { BranchService } from '../../../services/stage-1-client-and-order/branch-selection/branch.service';

const branchService = new BranchService();

/**
 * Хук для отримання списку всіх філій
 * Відповідальність: тільки завантаження даних
 */
export const useBranchList = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: () => getAllBranchLocations({ active: true }),
    select: (response) => response.data || [],
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });
};
