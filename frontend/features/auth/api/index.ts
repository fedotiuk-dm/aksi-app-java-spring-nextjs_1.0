/**
 * @fileoverview Auth API хуки з використанням Orval згенерованих клієнтів
 *
 * Використовує:
 * - Orval згенеровані auth функції
 * - React Query для стану та кешування
 * - Zod схеми для валідації
 */

// Використовуємо готові Orval хуки
import {
  useAuthLogin,
  useAuthRegister,
  useAuthRefreshToken,
  useAuthTestEndpoint,
} from '@/shared/api/generated/auth';

import type {
  LoginRequest,
  RegisterRequest,
  AuthLogin200,
  AuthRegister200,
  AuthRefreshToken200,
} from '@/shared/api/generated/auth';

/**
 * Хук для авторизації користувача
 * Обгортка над Orval згенерованим useAuthLogin
 */
export const useLogin = () => {
  return useAuthLogin({
    mutation: {
      onError: (error) => {
        console.error('❌ Помилка при вході в систему:', error);
      },
      onSuccess: (data) => {
        console.log('✅ Успішний вхід в систему:', data);
      },
    },
  });
};

/**
 * Хук для реєстрації користувача
 * Обгортка над Orval згенерованим useAuthRegister
 */
export const useRegister = () => {
  return useAuthRegister({
    mutation: {
      onError: (error) => {
        console.error('❌ Помилка при реєстрації:', error);
      },
      onSuccess: (data) => {
        console.log('✅ Успішна реєстрація:', data);
      },
    },
  });
};

/**
 * Хук для оновлення JWT токена
 * Обгортка над Orval згенерованим useAuthRefreshToken
 */
export const useRefreshToken = () => {
  return useAuthRefreshToken({
    mutation: {
      onError: (error) => {
        console.error('❌ Помилка при оновленні токена:', error);
      },
      onSuccess: (data) => {
        console.log('✅ Токен успішно оновлено:', data);
      },
    },
  });
};

/**
 * Хук для тестування доступності auth API
 * Обгортка над Orval згенерованим useAuthTestEndpoint
 */
export const useAuthTest = () => {
  return useAuthTestEndpoint({
    query: {
      staleTime: 5 * 60 * 1000, // 5 хвилин
      retry: 1,
    },
  });
};

/**
 * Хук для виходу з системи
 * Поки що використовує локальну логіку, оскільки logout endpoint не реалізований на бекенді
 */
export const useLogout = () => {
  // TODO: Додати logout endpoint на бекенді та використати Orval хук
  return {
    mutate: () => {
      console.log('🚪 Вихід з системи (локальна логіка)');
    },
    isPending: false,
    isError: false,
    error: null,
  };
};

// 📝 Експорт типів для зручності
export type { LoginRequest, RegisterRequest, AuthLogin200, AuthRegister200, AuthRefreshToken200 };
