/**
 * @fileoverview Хук для виходу з системи
 */

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/features/auth';
import { useLogout as useLogoutMutation } from '@/shared/api/generated/auth';
import { useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuthStore = useAuthStore.getState().logout;

  const logoutMutation = useLogoutMutation({
    mutation: {
      onSuccess: () => {
        // Clear local auth state
        clearAuthStore();

        // Clear all cached queries
        queryClient.clear();

        // Show success message
        toast.success('Ви успішно вийшли з системи');

        // Redirect to login page
        router.push('/login');
      },
      onError: (error) => {
        console.error('Logout error:', error);
        toast.error('Помилка при виході з системи');

        // Even on error - clear local state and redirect
        clearAuthStore();
        queryClient.clear();
        router.push('/login');
      },
    },
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return {
    logout: handleLogout,
    isLoading: logoutMutation.isPending,
  };
};