'use client';

import { createContext, useContext } from 'react';
import { useGetServerTime } from '@api/auth';
import type { ReactNode } from 'react';
import type { ServerTimeResponse } from '@api/auth';

interface TimeSyncContextValue {
  serverTime: ServerTimeResponse | undefined;
  isLoading: boolean;
  error: unknown;
}

const TimeSyncContext = createContext<TimeSyncContextValue | undefined>(undefined);

interface TimeSyncProviderProps {
  children: ReactNode;
}

/**
 * Provider для синхронізації часу з сервером через Orval SDK
 */
export function TimeSyncProvider({ children }: TimeSyncProviderProps) {
  const { data: serverTime, isLoading, error } = useGetServerTime({
    query: {
      refetchInterval: 5 * 60 * 1000, // 5 minutes
      staleTime: 4 * 60 * 1000, // 4 minutes
      refetchOnWindowFocus: true,
    },
  });

  const value: TimeSyncContextValue = {
    serverTime,
    isLoading,
    error,
  };

  return (
    <TimeSyncContext.Provider value={value}>
      {children}
    </TimeSyncContext.Provider>
  );
}

/**
 * Hook для доступу до серверного часу
 */
export function useServerTime(): TimeSyncContextValue {
  const context = useContext(TimeSyncContext);
  if (context === undefined) {
    throw new Error('useServerTime must be used within a TimeSyncProvider');
  }
  return context;
}

export default TimeSyncProvider;