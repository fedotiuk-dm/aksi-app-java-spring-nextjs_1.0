'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { LoginRequest } from '@/shared/api/generated/auth';

import { useLogin as useApiLogin } from '../api';
import { adaptAuthResponseToAuthUser } from '../model/types';
import { useAuthStore } from '../store';

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

  // Отримуємо хук для API-запиту (тепер з оновленим Orval)
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

      console.log('✅ Успішний логін, відповідь:', response);

      // Конвертуємо API response в AuthUser через адаптер
      const user = adaptAuthResponseToAuthUser(response);

      // Зберігаємо користувача в store
      setUser(user);

      console.log('🔄 Перенаправляємо користувача на:', redirectTo);
      console.log('👤 Користувач збережений:', user);

      // Додаємо невелику затримку перед перенаправленням
      setTimeout(() => {
        router.push(redirectTo);
        console.log('✅ Логін завершено успішно, перенаправлення виконано');
      }, 50);

      return response;
    } catch (error: unknown) {
      // 🚨 Обробляємо помилки
      const apiError = error as { message?: string; status?: number };
      const errorMessage = apiError?.message || 'Помилка при вході в систему';

      console.error('❌ Помилка при вході в систему:', error);
      setError(errorMessage);
      setStoreError({ message: errorMessage, status: apiError?.status || 500 });
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
