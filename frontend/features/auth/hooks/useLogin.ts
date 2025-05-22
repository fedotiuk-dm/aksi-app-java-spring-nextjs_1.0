'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLogin as useApiLogin } from '../api';
import { useAuthStore } from '../store';

import type { LoginRequest } from '@/lib/api';

/**
 * Клієнтський хук для входу користувача у систему
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const setStoreError = useAuthStore((state) => state.setError);
  const setStoreLoading = useAuthStore((state) => state.setLoading);

  // Отримуємо хук для API-запиту
  const apiLoginMutation = useApiLogin();

  /**
   * Функція для входу користувача
   * @param credentials - дані для входу
   * @param redirectTo - шлях, на який перенаправити після успішного входу
   */
  const login = async (credentials: LoginRequest, redirectTo: string = '/dashboard') => {
    try {
      setIsLoading(true);
      setStoreLoading(true);
      setError(null);
      setStoreError(null);

      // Використовуємо оновлений API хук для логіну
      const user = await apiLoginMutation.mutateAsync(credentials);

      // Зберігаємо дані користувача в глобальному стані
      setUser(user);

      // Перенаправляємо користувача на вказаний маршрут
      router.push(redirectTo);

      return user;
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Помилка при вході в систему';
      console.error('Помилка при вході в систему:', error);
      setError(errorMessage);
      setStoreError({ message: errorMessage, status: 401 });
      throw error;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
