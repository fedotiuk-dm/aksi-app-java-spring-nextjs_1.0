'use client';

import { ReactNode } from 'react';

import PageLayout from '@/components/layout/PageLayout';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
