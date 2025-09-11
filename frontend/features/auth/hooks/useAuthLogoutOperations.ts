/**
 * @fileoverview Auth logout operations using Orval API hooks
 * Handles user logout with proper state cleanup and navigation
 */

'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore, getErrorMessage } from '@/features/auth';
import { useLogout as useLogoutMutation } from '@/shared/api/generated/auth';
import { useQueryClient } from '@tanstack/react-query';

export const useAuthLogoutOperations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuthStore = useAuthStore.getState().logout;

  // Handle successful logout
  const handleLogoutSuccess = () => {
    clearAuthStore();
    queryClient.clear();
    toast.success('You have been successfully logged out');
    router.push('/login');
  };

  // Handle logout error
  const handleLogoutError = (error: { response?: { data?: { message?: string } } }) => {
    toast.error(getErrorMessage(error, 'Logout failed'));
    // Clear state even on error
    clearAuthStore();
    queryClient.clear();
    router.push('/login');
  };

  const logoutMutation = useLogoutMutation({
    mutation: {
      onSuccess: handleLogoutSuccess,
      onError: handleLogoutError,
    },
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return {
    logout,
    isLoading: logoutMutation.isPending,
  };
};
