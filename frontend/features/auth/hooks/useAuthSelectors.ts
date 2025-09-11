/**
 * @fileoverview Auth selectors hook
 * Provides role-based and permission-based selectors for auth state
 */

'use client';

import {
  useAuthStore,
  selectIsAdmin,
  selectIsManager,
  selectIsOperator,
  selectIsCleaner,
  selectIsDriver,
  selectHasPermission,
  selectPermissions,
  selectCurrentBranchId,
  selectCurrentBranchName,
  selectRequiresBranchSelection,
} from '@/features/auth';

/**
 * Hook for role-based selectors
 * Provides easy access to user role checks
 */
export const useAuthSelectors = () => {
  const store = useAuthStore();

  return {
    // Role selectors
    isAdmin: selectIsAdmin(store),
    isManager: selectIsManager(store),
    isOperator: selectIsOperator(store),
    isCleaner: selectIsCleaner(store),
    isDriver: selectIsDriver(store),

    // Permission selectors
    permissions: selectPermissions(store),
    hasPermission: (permission: string) => selectHasPermission(store, permission),

    // Branch selectors
    currentBranchId: selectCurrentBranchId(store),
    currentBranchName: selectCurrentBranchName(store),
    requiresBranchSelection: selectRequiresBranchSelection(store),

    // Role hierarchy helpers
    hasHigherRole: (requiredRole: string) => {
      const roleHierarchy = { admin: 100, manager: 80, operator: 40, cleaner: 20, driver: 20 };
      const userRole = store.user?.roles?.[0];
      if (!userRole) return false;
      return (
        roleHierarchy[userRole as keyof typeof roleHierarchy] >=
        roleHierarchy[requiredRole as keyof typeof roleHierarchy]
      );
    },
  };
};
