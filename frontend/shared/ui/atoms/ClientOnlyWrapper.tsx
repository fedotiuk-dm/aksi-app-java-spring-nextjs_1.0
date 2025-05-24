'use client';

import { ReactNode } from 'react';

import { useIsClient } from '@/shared/lib/hooks';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Компонент-обгортка для рендерингу тільки на клієнті
 * Допомагає уникнути проблем з гідратацією, спричинених браузерними розширеннями
 */
export const ClientOnlyWrapper: React.FC<ClientOnlyWrapperProps> = ({
  children,
  fallback = null,
}) => {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
