/**
 * @fileoverview Хук для оновлення сесії
 * 
 * В session-based auth немає окремого refresh token,
 * тому цей хук просто перевіряє поточну сесію
 */

import { useGetCurrentSession } from '@/shared/api/generated/auth';
import { useAuthStore } from '@/features/auth';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  
  const { refetch, isRefetching } = useGetCurrentSession({
    query: {
      enabled: false,
    },
  });

  const refreshSession = async () => {
    try {
      const { data: session } = await refetch();
      if (session) {
        setSession(session);
        // Invalidate all queries to refresh data
        await queryClient.invalidateQueries();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session refresh error:', error);
      setSession(null);
      return false;
    }
  };

  return {
    refreshToken: refreshSession,
    isRefreshing: isRefetching,
  };
};