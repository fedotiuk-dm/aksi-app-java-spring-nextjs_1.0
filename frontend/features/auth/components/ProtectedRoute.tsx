'use client';

/**
 * @fileoverview Компонент для захисту роутів
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'OPERATOR';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
    }
  }, [isLoading, isAuthenticated, pathname, redirectTo, router]);

  // Показуємо loader під час перевірки
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Перевіряємо автентифікацію
  if (!isAuthenticated || !user) {
    return null; // Router.push вже відпрацює в useEffect
  }

  // Перевіряємо роль, якщо вказана
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        p={3}
      >
        <Box textAlign="center">
          <h2>Доступ заборонено</h2>
          <p>У вас немає прав для перегляду цієї сторінки.</p>
          <p>Необхідна роль: {requiredRole}</p>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};