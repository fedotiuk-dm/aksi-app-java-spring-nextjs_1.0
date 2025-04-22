'use client';

import { useAuthStore } from '../store';

/**
 * Хук для отримання інформації про поточного користувача
 * та методів для управління автентифікацією
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

  return {
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
  };
};
