'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLogin as useApiLogin } from '../api';
import { adaptOrvalLoginResponse } from '../model/types';
import { useAuthStore } from '../store';

import type { LoginRequest } from '@/shared/api/generated/auth';

/**
 * Клієнтський хук для входу користувача у систему
 * Використовує оновлені Orval згенеровані API клієнти
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const setStoreError = useAuthStore((state) => state.setError);
  const setStoreLoading = useAuthStore((state) => state.setLoading);

  // Отримуємо хук для API-запиту (тепер з Orval)
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

      // Використовуємо оновлений Orval API хук для логіну
      const response = await apiLoginMutation.mutateAsync({ data: credentials });

      // Адаптуємо Orval response до AuthUser формату
      const user = adaptOrvalLoginResponse(response);

      // Зберігаємо дані користувача в глобальному стані
      setUser(user);

      console.log('🔄 Перенаправляємо користувача на:', redirectTo);
      console.log('👤 Користувач збережений:', user);

      // Додаємо невелику затримку перед перенаправленням
      setTimeout(() => {
        router.push(redirectTo);
        console.log('✅ Логін завершено успішно, перенаправлення виконано');
      }, 50);

      return user;
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Помилка при вході в систему';
      console.error('❌ Помилка при вході в систему:', error);
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
    // Додаткові властивості з React Query
    isApiLoading: apiLoginMutation.isPending,
    apiError: apiLoginMutation.error,
  };
};
