/**
 * @fileoverview Auth API хуки з використанням Orval згенерованих клієнтів
 *
 * Використовує:
 * - Orval згенеровані auth функції
 * - React Query для стану та кешування
 * - Zod схеми для валідації
 */

import { useMutation, useQuery } from '@tanstack/react-query';

import { getAksiApi } from '@/shared/api/generated/auth/aksiApi';

import type {
  LoginRequest,
  RegisterRequest,
  AuthLogin200,
  AuthRegister200,
  AuthRefreshToken200,
} from '@/shared/api/generated/auth/aksiApi.schemas';

// 🔐 Ініціалізуємо auth API клієнт
const authApi = getAksiApi();

/**
 * Хук для авторизації користувача
 * Використовує Orval згенерований authLogin клієнт
 */
export const useLogin = () => {
  return useMutation<AuthLogin200, Error, LoginRequest>({
    mutationFn: async (loginData) => {
      return await authApi.authLogin(loginData);
    },
    onError: (error) => {
      console.error('❌ Помилка при вході в систему:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Успішний вхід в систему:', data);
    },
  });
};

/**
 * Хук для реєстрації користувача
 * Використовує Orval згенерований authRegister клієнт
 */
export const useRegister = () => {
  return useMutation<AuthRegister200, Error, RegisterRequest>({
    mutationFn: async (registerData) => {
      return await authApi.authRegister(registerData);
    },
    onError: (error) => {
      console.error('❌ Помилка при реєстрації:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Успішна реєстрація:', data);
    },
  });
};

/**
 * Хук для оновлення JWT токена
 * Використовує Orval згенерований authRefreshToken клієнт
 */
export const useRefreshToken = () => {
  return useMutation<AuthRefreshToken200, Error, string>({
    mutationFn: async (refreshToken) => {
      return await authApi.authRefreshToken(refreshToken);
    },
    onError: (error) => {
      console.error('❌ Помилка при оновленні токена:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Токен успішно оновлено:', data);
    },
  });
};

/**
 * Хук для тестування доступності auth API
 * Використовує Orval згенерований authTestEndpoint клієнт
 */
export const useAuthTest = () => {
  return useQuery<string, Error>({
    queryKey: ['auth', 'test'],
    queryFn: async () => {
      return await authApi.authTestEndpoint();
    },
    staleTime: 5 * 60 * 1000, // 5 хвилин
    retry: 1,
  });
};

/**
 * Хук для виходу з системи
 * Поки що використовує локальну логіку, оскільки logout endpoint не реалізований на бекенді
 */
export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      // TODO: Додати logout endpoint на бекенді
      // Поки що просто очищуємо локальний стан
      console.log('🚪 Вихід з системи (локальна логіка)');
      return void 0;
    },
    onSuccess: () => {
      console.log('✅ Успішний вихід з системи');
    },
  });
};

// 📝 Експорт типів для зручності
export type { LoginRequest, RegisterRequest, AuthLogin200, AuthRegister200, AuthRefreshToken200 };
