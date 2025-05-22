'use client';

import { CircularProgress, Grid, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store';

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
  // Отримуємо стан авторизації і методи для роботи з ним
  const { isLoggedIn, role } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);
  const clearError = useAuthStore((state) => state.clearError);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Надійна перевірка сесії користувача при монтуванні компонента
  useEffect(() => {
    // Очищуємо помилки при монтуванні
    clearError();
    setAuthError(null);

    const verifySession = async () => {
      try {
        // Перевіряємо сесію користувача через /api/auth/me
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store', // важливо: не кешувати цей запит
        });

        if (response.ok) {
          // Є авторизація - оновлюємо дані користувача в стані
          const userData = await response.json();
          console.log('Авторизація підтверджена, оновлюємо дані користувача');
          // Зберігаємо дані користувача в глобальному стані
          setUser(userData);
        } else {
          // Немає авторизації
          console.log('Немає авторизації, перенаправляємо на логін');
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Помилка при перевірці сесії:', error);
        setAuthError('Помилка при перевірці авторизації');
      } finally {
        // Завершуємо завантаження в будь-якому випадку
        setIsLoading(false);
      }
    };

    // Запускаємо перевірку сесії негайно
    verifySession();

    return () => {
      // Очищення при розмонтуванні
    };
  }, [router, redirectTo, setUser, clearError]);

  // Перевірка на ролі користувача, якщо вказано
  useEffect(() => {
    // Чекаємо завершення завантаження і перевіряємо ролі
    if (
      !isLoading &&
      isLoggedIn &&
      allowedRoles &&
      allowedRoles.length > 0 &&
      role &&
      !allowedRoles.includes(role)
    ) {
      console.log(
        `Користувач не має необхідної ролі [${role}], потрібна одна з: [${allowedRoles.join(', ')}]`
      );
      router.push('/forbidden');
    }
  }, [isLoading, isLoggedIn, router, role, allowedRoles]);

  // Відображення завантаження
  if (isLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Grid size={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Перевірка авторизації...
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }

  // Якщо є помилка авторизації
  if (authError) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Grid size={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body1" color="error" gutterBottom>
              {authError}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Спробуйте оновити сторінку або увійти знову.
            </Typography>
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
