/**
 * @fileoverview Auth login operations using Orval API hooks
 * Thin wrapper over Orval with form validation and navigation
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useLogin, loginBody, useGetCurrentSession } from '@/shared/api/generated/auth';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  getUserDisplayName,
  shouldRedirectToBranchSelection,
  getRedirectUrl,
  getErrorMessage,
  useAuthStore,
} from '@/features/auth';

// Use generated schema for validation
type LoginFormData = z.infer<typeof loginBody>;

export const useAuthLoginOperations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  // Orval hooks for session management
  const getCurrentSessionQuery = useGetCurrentSession({
    query: { enabled: false },
  });

  // Main login mutation with simplified success handler
  const loginMutation = useLogin({
    mutation: {
      onSuccess: async (loginResponse) => {
        // Update store with user data
        setUser(loginResponse);

        // Fetch and set session data
        const { data: session } = await getCurrentSessionQuery.refetch();
        if (session) {
          setSession(session);
        }

        // Show success message
        const displayName = getUserDisplayName(loginResponse);
        toast.success(`Welcome, ${displayName}!`);

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries();

        // Handle navigation
        if (shouldRedirectToBranchSelection(loginResponse)) {
          router.push('/branch-selection');
        } else {
          router.push(getRedirectUrl());
        }
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        const message = getErrorMessage(error, 'Invalid username or password');
        toast.error(message);
        form.setError('root', { message });
      },
    },
  });

  // Form configuration
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginBody),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync({ data });
  };

  return {
    form,
    handleSubmit,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
