'use client';

/**
 * @fileoverview Provider для ініціалізації auth при завантаженні додатку
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth-store';
import { authService } from '../api/auth-service';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();
  const initializeRef = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Перевіряємо чи це сторінка логіну
      const isLoginPage = window.location.pathname === '/login';
      
      // Якщо це сторінка логіну - не намагаємось отримати користувача
      if (isLoginPage) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Просто намагаємось отримати поточного користувача
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch {
        // Користувач не авторизований - це нормально
        console.log('User not authenticated - this is expected on initial load');
        // Очищаємо стан користувача
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Запобігаємо подвійному виклику в React.StrictMode
    if (initializeRef.current) return;
    initializeRef.current = true;

    initializeAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
};
