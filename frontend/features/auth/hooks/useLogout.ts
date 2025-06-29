'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLogout as useApiLogout } from '../api';
import { useAuthStore } from '../store';

/**
 * Хук для виходу користувача із системи
 * Використовує оновлені Orval згенеровані API клієнти
 */
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logoutStore = useAuthStore((state) => state.logout);

  // Отримуємо хук для API-запиту (тепер з Orval)
  const apiLogout = useApiLogout();

  /**
   * Функція виходу користувача із системи
   * @param redirectTo - шлях для перенаправлення після виходу
   */
  const logout = async (redirectTo: string = '/login') => {
    try {
      setIsLoading(true);
      setError(null);

      // Викликаємо API для виходу (поки що тільки локальна логіка)
      apiLogout.mutate();

      // Очищаємо стан авторизації
      logoutStore();

      // Очищаємо токен з localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        console.log('🗑️ Токен видалено з localStorage');
      }

      console.log('✅ Успішний вихід з системи');

      // Перенаправляємо на цільову сторінку
      router.push(redirectTo);
    } catch (error) {
      console.error('❌ Помилка при виході:', error);

      // Навіть якщо виникла помилка, все одно очищаємо стан авторизації
      logoutStore();

      // Очищаємо токен з localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }

      // Перенаправляємо на сторінку входу
      router.push(redirectTo);

      // Встановлюємо повідомлення про помилку
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка при виході';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
    // Додаткові властивості з React Query
    isApiLoading: apiLogout.isPending,
    apiError: apiLogout.error,
    logoutMutation: apiLogout,
  };
};
