'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeRegistry } from './theme-registry';
import { Toaster } from 'react-hot-toast';

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
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {children}
      </ThemeRegistry>
    </QueryClientProvider>
  );
}
