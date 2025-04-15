'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClient } from '../api/clientsApi';
import { toast } from 'react-hot-toast';

/**
 * Хук для видалення клієнта
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success('Клієнта успішно видалено');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error('Помилка при видаленні клієнта');
    },
  });
};
