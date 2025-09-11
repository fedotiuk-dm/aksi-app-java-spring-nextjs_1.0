/**
 * @fileoverview Auth operations using Orval API hooks
 * Main auth hook with session management and state operations
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { useGetCurrentSession } from '@/shared/api/generated/auth';
import { useAuthLogoutOperations } from '@/features/auth';

export const useAuthOperations = () => {
  const store = useAuthStore();
  const setSession = store.setSession;

  // Use Orval hook for session management
  const sessionQuery = useGetCurrentSession({
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
      enabled: true,
    },
  });

  // Sync session data with store
  useEffect(() => {
    if (sessionQuery.data) {
      setSession(sessionQuery.data);
    } else if (sessionQuery.error) {
      setSession(null);
    }
  }, [sessionQuery.data, sessionQuery.error, setSession]);

  // Logout operation from separate hook
  const { logout } = useAuthLogoutOperations();

  const checkAuth = async () => {
    const { data } = await sessionQuery.refetch();
    return !!data;
  };

  return {
    // Core state
    user: store.user,
    session: store.session || sessionQuery.data || null,
    isAuthenticated: store.isAuthenticated || !!sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    error: sessionQuery.error?.message || null,

    // Actions
    logout,
    checkAuth,
    refetchSession: sessionQuery.refetch,
  };
};
