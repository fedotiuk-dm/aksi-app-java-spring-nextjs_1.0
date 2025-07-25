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
    // Запобігаємо подвійному виклику в React.StrictMode
    if (initializeRef.current) return;
    initializeRef.current = true;
    
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setLoading(true);
    try {
      // Просто намагаємось отримати поточного користувача
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      // Користувач не авторизований - це нормально
      console.log('User not authenticated');
    } finally {
      setLoading(false);
    }
  };

  return <>{children}</>;
};