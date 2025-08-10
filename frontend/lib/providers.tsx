'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ClientOnlyToaster } from '@/components/ui/ClientOnlyToaster';
import { AuthProvider } from '@/features/auth';
import { TimeSyncProvider } from '@/shared/lib/providers';

import { queryClient } from './reactQuery';
import { AppThemeProvider } from './theme-provider';

/**
 * Основний провайдер додатку, який об'єднує всі провайдери:
 * - React Query для керування станом даних та кешуванням
 * - AppThemeProvider для MUI, темної теми та стилів
 * - TimeSyncProvider для синхронізації часу з сервером
 * - Toaster для сповіщень
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TimeSyncProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppThemeProvider>
            <AuthProvider>
              {/* Клієнтський компонент для сповіщень */}
              <ClientOnlyToaster position="top-right" toastOptions={{ duration: 4000 }} />

              {children}
            </AuthProvider>
          </AppThemeProvider>
        </LocalizationProvider>
      </TimeSyncProvider>
    </QueryClientProvider>
  );
}
