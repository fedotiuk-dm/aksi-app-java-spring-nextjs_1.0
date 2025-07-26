/**
 * @fileoverview Хук для оновлення токену
 */

import { useRefreshToken as useRefreshTokenMutation } from '@/shared/api/generated/auth';
import { useAuthStore } from '../store/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/shared/api/generated/user';

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const { refetch: refetchUser } = useGetCurrentUser({
    query: {
      enabled: false,
    },
  });

  const refreshTokenMutation = useRefreshTokenMutation({
    mutation: {
      onSuccess: async () => {
        try {
          // Refetch current user after token refresh
          const { data: user } = await refetchUser();
          if (user) {
            setUser(user);
          }

          // Invalidate all queries to refresh data with new token
          await queryClient.invalidateQueries();
        } catch (error) {
          console.error('Error fetching user after token refresh:', error);
        }
      },
      onError: (error) => {
        console.error('Token refresh error:', error);
        // If token refresh fails, user needs to login again
        setUser(null);
      },
    },
  });

  return {
    refreshToken: () => refreshTokenMutation.mutateAsync(),
    isRefreshing: refreshTokenMutation.isPending,
  };
};