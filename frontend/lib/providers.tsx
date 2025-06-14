'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { ClientOnlyToaster } from '@/components/ui/ClientOnlyToaster';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { AuthInitializer } from '@/features/auth/components/AuthInitializer';

import { queryClient } from './reactQuery';
import { ThemeRegistry } from './theme-registry';

/**
 * Основний провайдер додатку, який об'єднує всі провайдери:
 * - React Query для керування станом даних та кешуванням
 * - ThemeRegistry для MUI та стилів
 * - Toaster для сповіщень
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeRegistry>
        <AuthInitializer>
          <AuthGuard>
            {/* Клієнтський компонент для сповіщень */}
            <ClientOnlyToaster position="top-right" toastOptions={{ duration: 4000 }} />

            {children}
          </AuthGuard>
        </AuthInitializer>
      </ThemeRegistry>
    </QueryClientProvider>
  );
}
