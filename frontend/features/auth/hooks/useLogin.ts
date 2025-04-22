'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';
import { useLogin as useApiLogin } from '../api';
import type { LoginRequest } from '@/lib/api/generated/models/LoginRequest';
import { convertToAuthUser } from '../model/types';

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
  const login = async (
    credentials: LoginRequest,
    redirectTo: string = '/dashboard'
  ) => {
    try {
      setIsLoading(true);
      setStoreLoading(true);
      setError(null);
      setStoreError(null);
      
      // Використовуємо Next.js API роут для логіну
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Помилка при вході в систему';
        setError(errorMessage);
        setStoreError({ message: errorMessage, status: response.status });
        throw new Error(errorMessage);
      }
      
      // Отримуємо дані користувача
      const authResponse = await response.json();
      
      // Конвертуємо відповідь до формату AuthUser
      const userData = convertToAuthUser(authResponse);
      
      // Зберігаємо дані користувача у стані
      setUser(userData);
      
      // Перенаправляємо на цільову сторінку
      router.push(redirectTo);
      
      return userData;
    } catch (error) {
      console.error('Помилка при спробі входу:', error);
      
      // Обробляємо помилку
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка при вході';
      setError(errorMessage);
      
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
    // Надаємо доступ до оригінального API, якщо потрібно
    loginMutation: apiLoginMutation,
  };
};
