'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/authTypes';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Компонент для захисту маршрутів
 * Перевіряє, чи користувач авторизований та має необхідні ролі
 */
export const AuthGuard = ({
  children,
  requiredRoles = [],
  redirectTo = '/login',
}: AuthGuardProps) => {
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Якщо користувач не авторизований, перенаправляємо на сторінку логіну
    if (!isLoggedIn) {
      router.push(redirectTo);
      return;
    }

    // Якщо вказані необхідні ролі, перевіряємо їх наявність
    if (requiredRoles.length > 0 && role) {
      const hasRequiredRole = requiredRoles.includes(role);
      if (!hasRequiredRole) {
        // Якщо немає потрібної ролі, перенаправляємо на сторінку логіну
        router.push(redirectTo);
      }
    }
  }, [isLoggedIn, role, requiredRoles, router, redirectTo]);

  // Якщо користувач не авторизований або не має необхідних ролей, нічого не показуємо
  if (!isLoggedIn || (requiredRoles.length > 0 && role && !requiredRoles.includes(role))) {
    return null;
  }

  // Якщо користувач авторизований і має необхідні ролі, показуємо дочірні компоненти
  return <>{children}</>;
};
