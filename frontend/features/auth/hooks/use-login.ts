/**
 * @fileoverview Хук для форми логіну
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/features/auth';
import { useLogin, loginBody, useGetCurrentSession } from '@/shared/api/generated/auth';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

// Use generated schema for validation
type LoginFormData = z.infer<typeof loginBody>;

export const useLoginForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const { refetch: refetchSession } = useGetCurrentSession({
    query: {
      enabled: false,
    },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async (loginResponse) => {
        try {
          console.log('Login response:', loginResponse);
          console.log('firstName:', loginResponse.firstName);
          console.log('username:', loginResponse.username);
          
          // Set user data from login response
          setUser(loginResponse);
          
          // Fetch current session info
          const { data: session } = await refetchSession();
          if (session) {
            setSession(session);
          }
          
          const displayName = loginResponse.firstName || loginResponse.username || 'Користувач';
          toast.success(`Вітаємо, ${displayName}!`);

          // Invalidate all queries to refresh data
          await queryClient.invalidateQueries();

          // Check if branch selection is required
          // Handle JsonNullable objects from Java backend
          const hasBranchId = loginResponse.branchId && 
                              (typeof loginResponse.branchId === 'string' || 
                               (loginResponse.branchId as any).present === true);
          
          if (loginResponse.requiresBranchSelection && !hasBranchId) {
            console.log('Redirecting to branch selection');
            router.push('/branch-selection');
          } else {
            // Redirect to dashboard or saved page
            const params = new URLSearchParams(window.location.search);
            const callbackUrl = params.get('callbackUrl') || '/dashboard';
            console.log('Redirecting to:', callbackUrl);
            // Use window.location for guaranteed redirect
            window.location.href = callbackUrl;
          }
        } catch (error) {
          console.error('Error fetching session after login:', error);
          // Still proceed with navigation
          const params = new URLSearchParams(window.location.search);
          const callbackUrl = params.get('callbackUrl') || '/dashboard';
          router.push(callbackUrl);
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
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Remove branchId from form data if not needed
    const { branchId, ...loginData } = data;
    await loginMutation.mutateAsync({ data: loginData });
  };

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
  };
};