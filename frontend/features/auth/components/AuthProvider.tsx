'use client';

/**
 * @fileoverview Provider для ініціалізації auth при завантаженні додатку
 */

import React, { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { useGetCurrentSession } from '@/shared/api/generated/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

  const { data: currentSession, error } = useGetCurrentSession({
    query: {
      enabled: !isLoginPage,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });

  useEffect(() => {
    if (currentSession) {
      setSession(currentSession);
      setLoading(false);
    } else if (error || isLoginPage) {
      setSession(null);
      setLoading(false);
    }
  }, [currentSession, error, setSession, setLoading, isLoginPage]);

  return <>{children}</>;
};
