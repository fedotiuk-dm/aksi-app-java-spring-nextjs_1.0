'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLogout as useApiLogout } from '../api';
import { useAuthStore } from '../store';

/**
 * Клієнтський хук для виходу користувача з системи
 * Використовує оновлені Orval згенеровані API клієнти
 */
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logoutFromStore = useAuthStore((state) => state.logout);
  const setStoreError = useAuthStore((state) => state.setError);
  const setStoreLoading = useAuthStore((state) => state.setLoading);

  // Отримуємо хук для API-запиту
  const apiLogoutMutation = useApiLogout();

  /**
   * Функція для виходу користувача
   * @param redirectTo - шлях, на який перенаправити після виходу
   */
  const logout = async (redirectTo: string = '/login') => {
    try {
      setIsLoading(true);
      setStoreLoading(true);
      setError(null);
      setStoreError(null);

      console.log('🚪 Виконуємо логаут...');

      // Використовуємо Orval API хук для логауту
      await apiLogoutMutation.mutateAsync();

      console.log('✅ Успішний логаут');

      // Очищуємо дані користувача зі стору
      logoutFromStore();

      console.log('🔄 Перенаправляємо на:', redirectTo);

      // Перенаправляємо на сторінку логіну
      setTimeout(() => {
        router.push(redirectTo);
        console.log('✅ Логаут завершено успішно, перенаправлення виконано');
      }, 50);
    } catch (error: unknown) {
      // 🚨 Обробляємо помилки
      const apiError = error as { message?: string; status?: number };
      const errorMessage = apiError?.message || 'Помилка при виході з системи';

      console.error('❌ Помилка при виході з системи:', error);
      setError(errorMessage);
      setStoreError({ message: errorMessage, status: apiError?.status || 500 });

      // Навіть якщо API помилка, очищуємо локальні дані
      logoutFromStore();

      // Все одно перенаправляємо на логін
      setTimeout(() => {
        router.push(redirectTo);
        console.log('⚠️ Логаут з помилкою, але перенаправлення виконано');
      }, 50);
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
    // Додаткові властивості з React Query
    isApiLoading: apiLogoutMutation.isPending,
    apiError: apiLogoutMutation.error,
  };
};
