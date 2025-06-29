/**
 * @fileoverview Auth API хуки з використанням поточних Orval згенерованих клієнтів
 *
 * Використовує:
 * - Orval згенеровані auth функції (оновлені назви)
 * - React Query для стану та кешування
 * - Zod схеми для валідації
 */

// Використовуємо поточні Orval хуки з правильними назвами
import {
  useLoginUser,
  useLogoutUser,
  useRefreshAccessToken,
  useGetCurrentUser,
} from '@/shared/api/generated/auth';
import type {
  LoginRequest,
  AuthResponse,
  UserResponse,
  LogoutResponse,
  RefreshTokenRequest,
} from '@/shared/api/generated/auth';

/**
 * Хук для авторизації користувача
 * Обгортка над Orval згенерованим useLoginUser
 */
export const useLogin = () => {
  return useLoginUser({
    mutation: {
      onError: (error) => {
        console.error('❌ Помилка при вході в систему:', error);
      },
      onSuccess: (data) => {
        console.log('✅ Успішний вхід в систему:', data);

        // Зберігаємо токени в localStorage
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      },
    },
  });
};

/**
 * Хук для виходу з системи
 * Використовує Orval згенерований useLogoutUser
 */
export const useLogout = () => {
  return useLogoutUser({
    mutation: {
      onError: (error) => {
        console.error('❌ Помилка при виході з системи:', error);
      },
      onSuccess: () => {
        console.log('✅ Успішний вихід з системи');

        // Очищуємо токени з localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      },
    },
  });
};

/**
 * Хук для оновлення JWT токена
 * Обгортка над Orval згенерованим useRefreshAccessToken
 */
export const useRefreshToken = () => {
  return useRefreshAccessToken({
    mutation: {
      onError: (error) => {
        console.error('❌ Помилка при оновленні токена:', error);

        // При помилці оновлення токена очищуємо localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      },
      onSuccess: (data) => {
        console.log('✅ Токен успішно оновлено:', data);

        // Зберігаємо новий токен
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
      },
    },
  });
};

/**
 * Хук для отримання поточного користувача
 * Використовує Orval згенерований useGetCurrentUser
 */
export const useCurrentUser = () => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // Використовуємо API тільки якщо є токен
  const getCurrentUserQuery = useGetCurrentUser({
    query: {
      enabled: Boolean(accessToken), // Виконуємо запит тільки якщо є токен
      staleTime: 5 * 60 * 1000, // Кешуємо на 5 хвилин
      retry: 1,
    },
  });

  const isAuthenticated = Boolean(accessToken) && !getCurrentUserQuery.isError;
  const isLoading = getCurrentUserQuery.isLoading && Boolean(accessToken);

  return {
    isAuthenticated,
    isLoading,
    user: getCurrentUserQuery.data,
    error: getCurrentUserQuery.error,
    accessToken,
    refetch: getCurrentUserQuery.refetch,
  };
};

// 📝 Експорт типів для зручності
export type { LoginRequest, AuthResponse, UserResponse, LogoutResponse, RefreshTokenRequest };
