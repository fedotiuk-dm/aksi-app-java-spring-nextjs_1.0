'use client';

import { useAuthTest } from '../api';
import { useAuthStore } from '../store';

/**
 * Хук для отримання інформації про поточного користувача
 * та методів для управління автентифікацією
 * Тепер з підтримкою Orval згенерованих API клієнтів
 */
export const useAuth = () => {
  // Витягуємо необхідні значення та методи з глобального стану авторизації
  const {
    isLoggedIn,
    username,
    name,
    email,
    role,
    userId,
    position,
    error,
    hasRole,
    checkIsLoggedIn,
  } = useAuthStore();

  // Додаємо можливість тестування auth API
  const authTest = useAuthTest();

  return {
    // Основні дані користувача
    isLoggedIn,
    username,
    name,
    email,
    role,
    userId,
    position,
    error,

    // Методи
    hasRole,
    checkIsLoggedIn,

    // API тестування
    authTest: {
      data: authTest.data,
      isLoading: authTest.isLoading,
      error: authTest.error,
      refetch: authTest.refetch,
    },
  };
};
