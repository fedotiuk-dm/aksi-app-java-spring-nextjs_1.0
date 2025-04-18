import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

/**
 * Хук для виходу користувача із системи
 */
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const logoutStore = useAuthStore((state) => state.logout);
  
  /**
   * Функція виходу користувача із системи
   * @param redirectTo - шлях для перенаправлення після виходу
   */
  const logout = async (redirectTo: string = '/login') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Викликаємо API для виходу
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Навіть якщо виникла помилка на сервері, вважаємо вихід успішним
      if (!response.ok) {
        console.warn('Помилка під час виходу на сервері, але сесія буде очищена локально');
      }
      
      // Очищаємо стан авторизації
      logoutStore();
      
      // Перенаправляємо на цільову сторінку
      router.push(redirectTo);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка виходу із системи';
      setError(errorMessage);
      
      // Все одно очищаємо стан авторизації локально
      logoutStore();
      
      // Перенаправляємо на сторінку логіну
      router.push(redirectTo);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    logout,
    isLoading,
    error,
  };
};
