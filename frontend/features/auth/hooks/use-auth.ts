/**
 * @fileoverview Основний auth хук для HttpOnly cookies
 */

import { useEffect } from 'react';
import {
  useAuthStore,
  selectIsAdmin,
  selectIsManager,
  selectIsOperator,
  selectIsCleaner,
  selectIsDriver,
  selectHasPermission,
  selectPermissions,
  selectCurrentBranchId,
  selectCurrentBranchName
} from '@/features/auth';
import { useGetCurrentSession } from '@/shared/api/generated/auth';
import { useLogout } from './use-logout';

export const useAuth = () => {
  const store = useAuthStore();
  const user = store.user;
  const session = store.session;
  const isAuthenticated = store.isAuthenticated;
  const setSession = store.setSession;
  const { logout: logoutAction } = useLogout();

  // Use generated hook to get current session
  const { data: currentSession, isLoading, error, refetch } = useGetCurrentSession({
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  });

  // Sync session data with store
  useEffect(() => {
    if (currentSession) {
      setSession(currentSession);
    } else if (error) {
      setSession(null);
    }
  }, [currentSession, error, setSession]);

  const checkAuth = async () => {
    const { data } = await refetch();
    return !!data;
  };

  return {
    // State
    user,
    session: session || currentSession || null,
    isAuthenticated: isAuthenticated || !!currentSession,
    isLoading,
    error: error ? String(error) : null,

    // Actions
    logout: logoutAction,
    checkAuth,
    refetchSession: refetch,

    // Role checks using selectors
    isAdmin: selectIsAdmin(store),
    isManager: selectIsManager(store),
    isOperator: selectIsOperator(store),
    isCleaner: selectIsCleaner(store),
    isDriver: selectIsDriver(store),

    // Permission checks
    permissions: selectPermissions(store),
    hasPermission: (permission: string) => selectHasPermission(store, permission),

    // Branch info
    currentBranchId: selectCurrentBranchId(store),
    currentBranchName: selectCurrentBranchName(store),
  };
};
