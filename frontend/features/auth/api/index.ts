import { useApiMutation } from '@/lib/api/hooks';

import { AuthUser } from '../model/types';

import type { LoginRequest } from '@/lib/api';

/**
 * Хук для авторизації користувача
 * Використовує локальний Next.js API роут для передачі credentials
 */
export const useLogin = () => {
  return useApiMutation<AuthUser, LoginRequest>(async (loginData) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при вході в систему');
    }

    return response.json();
  });
};

/**
 * Хук для виходу з системи
 */
export const useLogout = () => {
  return useApiMutation<void, void>(async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при виході з системи');
    }

    return void 0;
  });
};

/**
 * Хук для оновлення JWT токена
 */
export const useRefreshToken = () => {
  return useApiMutation<AuthUser, void>(async () => {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Не вдалося оновити токен');
    }

    return response.json();
  });
};

/**
 * Хук для отримання інформації про поточного користувача
 */
export const useGetCurrentUser = () => {
  return useApiMutation<AuthUser | null, void>(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Помилка при отриманні даних користувача:', error);
      return null;
    }
  });
};
