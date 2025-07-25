/**
 * @fileoverview Хук для виходу з системи
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/auth-store';
import { authService } from '../api/auth-service';

export const useLogout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Викликаємо API для очищення cookies на сервері
      await authService.logout();
      
      // Очищаємо локальний стан
      logout();
      
      // Показуємо повідомлення
      toast.success('Ви успішно вийшли з системи');
      
      // Перенаправляємо на сторінку логіну
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Помилка при виході з системи');
      
      // Навіть при помилці - очищаємо локальний стан і перенаправляємо
      logout();
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout: handleLogout,
    isLoading,
  };
};