/**
 * @fileoverview Auth password operations using Orval API hooks
 * Handles password change operations with form validation
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useChangePassword, changePasswordBody } from '@/shared/api/generated/user';
import { useAuthStore, getErrorMessage } from '@/features/auth';

// Use generated schema for validation
type ChangePasswordFormData = z.infer<typeof changePasswordBody>;

export const useAuthPasswordOperations = () => {
  const user = useAuthStore((state) => state.user);

  // Orval hook for password change
  const changePasswordMutation = useChangePassword({
    mutation: {
      onSuccess: () => {
        toast.success('Password changed successfully');
        form.reset();
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        const message = getErrorMessage(error, 'Failed to change password');
        toast.error(message);
        form.setError('root', { message });
      },
    },
  });

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordBody),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const handleSubmit = async (data: ChangePasswordFormData) => {
    if (!user?.userId) {
      toast.error('User not authenticated');
      return;
    }

    await changePasswordMutation.mutateAsync({
      userId: user.userId,
      data,
    });
  };

  return {
    form,
    handleSubmit,
    isLoading: changePasswordMutation.isPending,
  };
};
