/**
 * @fileoverview Auth token operations using Orval API hooks
 * Handles session refresh operations for session-based authentication
 */

'use client';

import { useGetCurrentSession } from '@/shared/api/generated/auth';
import { useAuthStore } from '@/features/auth';
import { useQueryClient } from '@tanstack/react-query';

export const useAuthTokenOperations = () => {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  // Orval hook for session management
  const sessionQuery = useGetCurrentSession({
    query: {
      enabled: false,
    },
  });

  const refreshSession = async () => {
    try {
      const { data: session } = await sessionQuery.refetch();
      if (session) {
        setSession(session);
        // Invalidate all queries to refresh data
        await queryClient.invalidateQueries();
        return true;
      }
      return false;
    } catch (error) {
      setSession(null);
      return false;
    }
  };

  return {
    refreshSession,
    isRefreshing: sessionQuery.isRefetching,
  };
};
