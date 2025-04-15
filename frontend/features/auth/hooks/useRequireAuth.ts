'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '../types';
import { useAuthStore } from './useAuthStore';

/**
 * Хук для захисту маршрутів, які потребують автентифікації
 *
 * @param requiredRoles - список ролей, які мають доступ до маршруту
 * @param redirectTo - маршрут, на який перенаправляти неавторизованих користувачів
 */
export function useRequireAuth(
  requiredRoles?: UserRole[],
  redirectTo: string = '/login'
) {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    // Ініціалізуємо стан автентифікації
    initAuth();

    // Затримка для завантаження даних
    const checkAuth = setTimeout(() => {
      // Користувач не автентифікований
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Якщо вказані ролі для доступу, перевіряємо роль користувача
      if (requiredRoles && requiredRoles.length > 0 && user) {
        if (!requiredRoles.includes(user.role)) {
          // Користувач не має необхідної ролі
          router.push('/dashboard');
        }
      }
    }, 500);

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, user, router, redirectTo, requiredRoles, initAuth]);

  return { isAuthenticated, user };
}
