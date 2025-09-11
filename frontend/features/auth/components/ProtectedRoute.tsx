'use client';

/**
 * @fileoverview Protected route component for route authorization
 */

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuthOperations, useAuthSelectors } from '@/features/auth';
import { type UserRole, type Permission } from '@/features/auth/constants/auth.constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  redirectTo = '/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthOperations();
  const { hasPermission } = useAuthSelectors();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
    }
  }, [isLoading, isAuthenticated, pathname, redirectTo, router]);

  // Show loader during authentication check
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return null; // Router.push will trigger in useEffect
  }

  // Check role if specified
  if (requiredRole && !user.roles?.includes(requiredRole)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={3}>
        <Box textAlign="center">
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
          <p>Required role: {requiredRole}</p>
        </Box>
      </Box>
    );
  }

  // Check permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={3}>
        <Box textAlign="center">
          <h2>Access Denied</h2>
          <p>You do not have permission to perform this action.</p>
          <p>Required permission: {requiredPermission}</p>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};
