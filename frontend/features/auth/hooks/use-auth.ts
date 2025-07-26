/**
 * @fileoverview Основний auth хук для HttpOnly cookies
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';
import { useGetCurrentUser } from '@/shared/api/generated/user';
import { useLogout } from './use-logout';

export const useAuth = () => {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const { logout: logoutAction } = useLogout();

  // Use generated hook to get current user
  const { data: currentUser, isLoading, error, refetch } = useGetCurrentUser({
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  });

  // Sync user data with store
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else if (error) {
      setUser(null);
    }
  }, [currentUser, error, setUser]);

  const checkAuth = async () => {
    const { data } = await refetch();
    return !!data;
  };

  return {
    // State
    user: user || currentUser || null,
    isAuthenticated: isAuthenticated || !!currentUser,
    isLoading,
    error: error ? String(error) : null,

    // Actions
    logout: logoutAction,
    checkAuth,
    refetchUser: refetch,

    // Role checks
    isAdmin: (user || currentUser)?.role === 'ADMIN',
    isOperator: (user || currentUser)?.role === 'OPERATOR',
    canManageUsers: (user || currentUser)?.role === 'ADMIN',
  };
};