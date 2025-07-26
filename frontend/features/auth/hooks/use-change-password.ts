/**
 * @fileoverview Хук для зміни пароля
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useChangeUserPassword, changeUserPasswordBody } from '@/shared/api/generated/user';
import { useAuthStore } from '../store/auth-store';

// Use generated schema for validation
type ChangePasswordFormData = z.infer<typeof changeUserPasswordBody>;

export const useChangePassword = () => {
  const user = useAuthStore((state) => state.user);

  const changePasswordMutation = useChangeUserPassword({
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
    resolver: zodResolver(changeUserPasswordBody),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!user?.id) {
      toast.error('Користувач не авторизований');
      return;
    }

    await changePasswordMutation.mutateAsync({
      userId: user.id,
      data,
    });
  };

  return {
    form,
    onSubmit,
    isLoading: changePasswordMutation.isPending,
  };
};