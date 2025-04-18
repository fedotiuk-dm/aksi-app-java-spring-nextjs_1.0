'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Провайдер авторизації, який ініціалізує стан авторизації
 * при завантаженні додатку і оновлює при необхідності
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Отримуємо дані користувача з сервера
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Якщо користувач не авторизований, очищаємо стан
          setUser(null);
        }
      } catch (error) {
        console.error('Помилка ініціалізації авторизації:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Встановлюємо таймер для оновлення токена
    // Оновлюємо кожні 10 хвилин, щоб запобігти закінченню терміну дії
    const refreshInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/auth/refresh-token', {
          method: 'POST',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Помилка оновлення токена:', error);
      }
    }, 10 * 60 * 1000); // 10 хвилин

    return () => {
      clearInterval(refreshInterval);
    };
  }, [setUser, setLoading]);

  // Повертаємо дочірні елементи лише після ініціалізації
  // Це запобігає проблемам з "гідратацією", коли стан на сервері та клієнті відрізняється
  return isInitialized ? <>{children}</> : null;
}
