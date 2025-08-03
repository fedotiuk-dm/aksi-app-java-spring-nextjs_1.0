/**
 * @fileoverview Хук для зміни пароля
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useChangePassword, changePasswordBody } from '@/shared/api/generated/user';
import { useAuthStore } from '@/features/auth';

// Use generated schema for validation
type ChangePasswordFormData = z.infer<typeof changePasswordBody>;

export const useChangePasswordForm = () => {
  const user = useAuthStore((state) => state.user);

  const changePasswordMutation = useChangePassword({
    mutation: {
      onSuccess: () => {
        toast.success('Пароль успішно змінено');
        form.reset();
      },
      onError: (error: Error) => {
        console.error('Change password error:', error);
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Помилка при зміні пароля';
        toast.error(message);
        form.setError('root', {
          message,
        });
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

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!user?.userId) {
      toast.error('Користувач не авторизований');
      return;
    }

    await changePasswordMutation.mutateAsync({
      userId: user.userId,
      data,
    });
  };

  return {
    form,
    onSubmit,
    isLoading: changePasswordMutation.isPending,
  };
};