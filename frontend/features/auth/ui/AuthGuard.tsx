'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Grid, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  allowedRoles?: string[];
}

/**
 * Компонент для захисту маршрутів, що потребують автентифікацію
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = '/login',
  allowedRoles,
}) => {
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Використовуємо setTimeout для імітації перевірки автентифікації
    // і уникнення миттєвих редіректів, що покращить UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Якщо не завантажується і користувач не автентифікований - редірект
    if (!isLoading && !isLoggedIn) {
      router.push(redirectTo);
      return;
    }

    // Перевірка на ролі користувача, якщо вказано
    if (
      !isLoading &&
      isLoggedIn &&
      allowedRoles &&
      allowedRoles.length > 0 &&
      role &&
      !allowedRoles.includes(role)
    ) {
      router.push('/forbidden');
    }
  }, [isLoading, isLoggedIn, router, redirectTo, role, allowedRoles]);

  // Відображення завантаження
  if (isLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Grid>
      </Grid>
    );
  }

  // Якщо користувач автентифікований і має потрібні ролі, показуємо контент
  if (isLoggedIn && (!allowedRoles || (role && allowedRoles.includes(role)))) {
    return <>{children}</>;
  }

  // За замовчуванням нічого не показуємо, поки йде перенаправлення
  return null;
};
