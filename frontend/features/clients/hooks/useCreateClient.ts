'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../api/clientsApi';
import { toast } from 'react-hot-toast';

/**
 * Хук для створення нового клієнта
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      toast.success('Клієнта успішно створено');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast.error('Помилка при створенні клієнта');
    },
  });
};
