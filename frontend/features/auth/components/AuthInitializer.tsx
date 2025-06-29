'use client';

import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

import { UserRole } from '../model/types';
import { useAuthStore } from '../store';

/**
 * Компонент для ініціалізації авторизації при завантаженні додатку
 * Перевіряє наявність токена в localStorage та відновлює стан користувача
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Перевіряємо наявність токена при завантаженні
    const initializeAuth = () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth-token');
      console.log(
        '🔍 AuthInitializer: Перевіряємо токен в localStorage:',
        token ? 'Знайдено' : 'Відсутній'
      );

      const AUTH_TOKEN_KEY = 'auth-token';

      if (!token) {
        console.log('❌ AuthInitializer: Токен відсутній, очищуємо стан');
        logout();
        setIsInitializing(false);
        return;
      }

      try {
        // Декодуємо JWT токен для отримання даних користувача
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔓 AuthInitializer: Декодовано JWT payload:', payload);

        // Перевіряємо чи токен не прострочений
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          console.log('⏰ AuthInitializer: Токен прострочений, очищуємо');
          localStorage.removeItem(AUTH_TOKEN_KEY);
          logout();
          setIsInitializing(false);
          return;
        }

        // Відновлюємо дані користувача з токена
        const userData = {
          id: payload.sub || payload.userId || payload.id || 'unknown',
          username: payload.username || payload.sub || 'unknown',
          name: payload.name || payload.fullName || 'Користувач',
          email: payload.email || '',
          role: (payload.role as UserRole) || UserRole.STAFF,
          position: payload.position,
        };

        console.log('✅ AuthInitializer: Відновлюємо користувача:', userData);
        setUser(userData);
        setIsInitializing(false);
      } catch (error) {
        console.error('❌ AuthInitializer: Помилка декодування токена:', error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        logout();
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [setUser, logout]);

  // Показуємо індикатор завантаження поки ініціалізуємося
  if (isInitializing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Box sx={{ color: 'text.secondary' }}>Ініціалізація...</Box>
      </Box>
    );
  }

  return <>{children}</>;
}
