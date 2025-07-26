/**
 * @fileoverview Хук для форми логіну
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/auth-store';
import { useLogin, loginBody } from '@/shared/api/generated/auth';
import { useGetCurrentUser } from '@/shared/api/generated/user';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

// Use generated schema for validation
type LoginFormData = z.infer<typeof loginBody>;

export const useLoginForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const { refetch: refetchUser } = useGetCurrentUser({
    query: {
      enabled: false,
    },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async () => {
        try {
          // Refetch current user after successful login
          const { data: user } = await refetchUser();
          if (user) {
            setUser(user);
            toast.success(`Вітаємо, ${user.firstName}!`);
          } else {
            toast.success('Вхід успішний!');
          }

          // Invalidate all queries to refresh data
          await queryClient.invalidateQueries();

          // Redirect to dashboard or saved page
          const params = new URLSearchParams(window.location.search);
          const callbackUrl = params.get('callbackUrl') || '/dashboard';
          router.push(callbackUrl);
        } catch (error) {
          console.error('Error fetching user after login:', error);
          toast.success('Вхід успішний!');
          router.push('/dashboard');
        }
      },
      onError: (error: Error) => {
        console.error('Login error:', error);
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Невірний логін або пароль';
        toast.error(message);
        form.setError('root', {
          message,
        });
      },
    },
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginBody),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync({ data });
  };

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
  };
};