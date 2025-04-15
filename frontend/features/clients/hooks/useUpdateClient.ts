'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClient } from '../api/clientsApi';
import { toast } from 'react-hot-toast';

interface UpdateClientParams {
  id: string;
  data: Record<string, unknown>;
}

/**
 * Хук для оновлення існуючого клієнта
 */
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateClientParams) => updateClient(id, data),
    onSuccess: (_, variables) => {
      toast.success('Клієнта успішно оновлено');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast.error('Помилка при оновленні клієнта');
    },
  });
};
