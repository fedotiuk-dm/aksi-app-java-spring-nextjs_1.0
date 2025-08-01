'use client';

import { ReactNode } from 'react';

import PageLayout from '@/components/layout/PageLayout';
import { ProtectedRoute } from '@/features/auth';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <PageLayout>{children}</PageLayout>
    </ProtectedRoute>
  );
}
