'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import { UserRole } from '../types';
import { useAuthStore } from '../hooks/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Компонент для захисту маршрутів, які потребують автентифікації
 */
export default function ProtectedRoute({
  children,
  requiredRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    initAuth();

    const checkAuth = setTimeout(() => {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRoles && requiredRoles.length > 0 && user) {
        if (!requiredRoles.includes(user.role)) {
          router.push('/dashboard');
          return;
        }
      }

      setIsChecking(false);
    }, 500);

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, user, router, redirectTo, requiredRoles, initAuth]);

  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Перевірка автентифікації...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
