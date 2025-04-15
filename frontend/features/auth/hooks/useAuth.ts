'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, logout } from '../api/authApi';
import { authTokens } from '../api/authApi';
import { AuthResponse } from '../types';

/**
 * Хук для автентифікації користувача
 */
export function useAuth() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: AuthResponse) => {
      console.log('Успішний логін, отримані дані (useAuth.ts):', data);

      try {
        // Перевіряємо різні варіанти структури відповіді
        const token = data.accessToken || data.token;
        const refreshToken = data.refreshToken;

        console.log('Токени отримані:', {
          hasToken: !!token,
          hasRefreshToken: !!refreshToken,
          tokenInfo: token ? `Довжина: ${token.length}` : 'відсутній',
        });

        if (token) {
          // Зберігаємо токени в localStorage
          authTokens.setTokens(token, refreshToken || '');

          // Примітка: токен в cookie встановлюється в authApi.ts

          console.log('Токени збережено. Перенаправлення на /dashboard');
          router.push('/dashboard');
        } else {
          console.error(
            'Неправильний формат відповіді від сервера - відсутній токен:',
            data
          );
          throw new Error('Отримана відповідь не містить токен автентифікації');
        }
      } catch (err) {
        console.error('Помилка при обробці успішної відповіді:', err);
      }
    },
    onError: (error) => {
      console.error('Помилка логіну (useAuth.ts):', error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      authTokens.clearTokens();
      router.push('/login');
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error || logoutMutation.error,
  };
}
