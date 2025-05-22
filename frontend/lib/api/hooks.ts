import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
  QueryClient,
} from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ApiError } from './generated';

/**
 * Конфігурація React Query клієнта для роботи з API
 */
export function configureQueryClient(queryClient: QueryClient) {
  // Глобальна обробка помилок
  queryClient.setDefaultOptions({
    queries: {
      retry: (failureCount, error) => {
        // Не повторювати запити при помилках авторизації
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        if (error instanceof ApiError) {
          toast.error(error.message || 'Помилка при виконанні запиту');
        }
      },
    },
  });
}

/**
 * Типізований хук useQuery для роботи з API
 */
export function useApiQuery<T, TQueryKey extends readonly unknown[] = readonly unknown[]>(
  queryKey: TQueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, ApiError, T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey,
    queryFn,
    ...options,
  });
}

/**
 * Типізований хук useMutation для роботи з API
 */
export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationFn'>
) {
  return useMutation<T, ApiError, V>({
    mutationFn,
    ...options,
  });
}
