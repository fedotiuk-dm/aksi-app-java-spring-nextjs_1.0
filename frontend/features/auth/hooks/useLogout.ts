'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';
import { useLogout as useApiLogout } from '../api';
import { useOrderWizardStore } from '@/features/order-wizard/model/store';

/**
 * Хук для виходу користувача із системи
 */
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const logoutStore = useAuthStore((state) => state.logout);
  
  // Отримуємо хук для API-запиту
  const apiLogout = useApiLogout();
  
  /**
   * Функція виходу користувача із системи
   * @param redirectTo - шлях для перенаправлення після виходу
   */
  const logout = async (redirectTo: string = '/login') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Викликаємо API для виходу
      await apiLogout.mutateAsync(undefined);
      
      // Очищаємо стан авторизації
      logoutStore();
      
      // Скидаємо стан Order Wizard
      useOrderWizardStore.getState().resetWizard();
      
      // Перенаправляємо на цільову сторінку
      router.push(redirectTo);
    } catch (error) {
      console.error('Помилка при виході:', error);
      
      // Навіть якщо виникла помилка, все одно очищаємо стан авторизації
      logoutStore();
      
      // Скидаємо стан Order Wizard
      useOrderWizardStore.getState().resetWizard();
      
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
    logoutMutation: apiLogout,
  };
};
