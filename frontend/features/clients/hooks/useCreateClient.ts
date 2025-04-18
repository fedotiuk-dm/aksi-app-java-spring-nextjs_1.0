'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientCreateRequest, createClient } from '../api/clientsApi';
import { toast } from 'react-hot-toast';
import { authTokens } from '@/features/auth/api/authApi';

/**
 * Хук для створення нового клієнта
 * @returns Мутація для створення клієнта
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const token = authTokens.getToken();

  return useMutation({
    mutationFn: async (data: ClientCreateRequest) => {
      // Перевірка наявності токена авторизації
      if (!token) {
        throw new Error('Необхідна авторизація для створення клієнта');
      }

      return await createClient(data);
    },
    onSuccess: () => {
      // Інвалідуємо кеш запитів після успішного створення
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Клієнта успішно створено');
    },
    onError: (error: Error) => {
      console.error('Помилка створення клієнта:', error);

      // Перевіряємо помилки авторизації
      if (error.message.includes('401') || error.message.includes('403')) {
        toast.error(
          'Помилка авторизації. Будь ласка, увійдіть в систему знову.'
        );
      } else {
        toast.error(`Помилка: ${error.message}`);
      }
    },
  });
};
