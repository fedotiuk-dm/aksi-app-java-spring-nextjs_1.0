'use client';

import { useCurrentUser } from '../api';
import { useAuthStore } from '../store';

/**
 * Хук для отримання інформації про поточного користувача
 * та методів для управління автентифікацією
 * Оновлено для використання нових Orval згенерованих API клієнтів та методів store
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
    isAdmin,
    isManagerOrAdmin,
    canHandleCash,
    canTakeOrders,
  } = useAuthStore();

  // Використовуємо новий API для отримання поточного користувача
  const currentUser = useCurrentUser();

  return {
    // Основні дані користувача (пріоритет API над store)
    isLoggedIn: currentUser.isAuthenticated || isLoggedIn,
    username: currentUser.user?.username || username,
    name: currentUser.user?.firstName || name,
    email: currentUser.user?.email || email,
    role: currentUser.user?.roles?.[0] || role,
    userId: currentUser.user?.id || userId,
    position,
    error: currentUser.error || error,

    // API дані
    user: currentUser.user,
    accessToken: currentUser.accessToken,
    isLoading: currentUser.isLoading,

    // Методи перевірки ролей (з store)
    hasRole,
    checkIsLoggedIn,
    isAdmin,
    isManagerOrAdmin,
    canHandleCash,
    canTakeOrders,

    // API методи
    refetch: currentUser.refetch,
  };
};
