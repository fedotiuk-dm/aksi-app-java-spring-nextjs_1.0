'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeRegistry } from './theme-registry';
// Імпортуємо клієнтський компонент для toaster замість прямого імпорту
import { ClientOnlyToaster } from '@/components/ui/ClientOnlyToaster';

// Створюємо клієнт React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 хвилин
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeRegistry>
        <ClientOnlyToaster position="top-right" toastOptions={{ duration: 4000 }} />
        {children}
      </ThemeRegistry>
    </QueryClientProvider>
  );
}
