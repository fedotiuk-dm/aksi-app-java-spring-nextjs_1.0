'use client';

/**
 * @fileoverview Auth provider component for initializing auth on app load
 * Manages session state and loading during authentication check
 */

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth';
import { useGetCurrentSession } from '@/shared/api/generated/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const SESSION_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);

  // Don't check session on login page to avoid unnecessary requests
  const isLoginPage = pathname === '/login';

  // Fetch current session using Orval hook
  const sessionQuery = useGetCurrentSession({
    query: {
      enabled: !isLoginPage,
      retry: false,
      staleTime: SESSION_STALE_TIME,
    },
  });

  // Update store when session data changes
  useEffect(() => {
    if (sessionQuery.data) {
      setSession(sessionQuery.data);
      setLoading(false);
    } else if (sessionQuery.error || isLoginPage) {
      setSession(null);
      setLoading(false);
    }
  }, [sessionQuery.data, sessionQuery.error, setSession, setLoading, isLoginPage]);

  return <>{children}</>;
};
