'use client';

/**
 * @fileoverview Provider для ініціалізації auth при завантаженні додатку
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';
import { useGetCurrentUser } from '@/shared/api/generated/user';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

  const { data: currentUser, error } = useGetCurrentUser({
    query: {
      enabled: !isLoginPage,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    } else if (error || isLoginPage) {
      setUser(null);
      setLoading(false);
    }
  }, [currentUser, error, setUser, setLoading, isLoginPage]);

  return <>{children}</>;
};
