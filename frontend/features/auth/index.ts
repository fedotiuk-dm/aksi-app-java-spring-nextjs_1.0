/**
 * @fileoverview Auth Feature Module для HttpOnly cookies
 * 
 * Нова архітектура з підтримкою HttpOnly cookies
 */

// Components
export { LoginForm } from './components/LoginForm';
export { LogoutButton } from './components/LogoutButton';
export { ProtectedRoute } from './components/ProtectedRoute';
export { AuthProvider } from './components/AuthProvider';

// Hooks
export { useAuth } from './hooks/use-auth';
export { useLoginForm } from './hooks/use-login';
export { useLogout } from './hooks/use-logout';
export { useRefreshToken } from './hooks/use-refresh-token';
export { useChangePasswordForm } from './hooks/use-change-password';

// Store and selectors
export { 
  useAuthStore,
  // Basic selectors
  selectUser,
  selectSession,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  // Role selectors
  selectUserRoles,
  selectHasRole,
  selectIsAdmin,
  selectIsManager,
  selectIsOperator,
  selectIsCleaner,
  selectIsDriver,
  selectIsAccountant,
  // Permission selectors
  selectPermissions,
  selectHasPermission,
  // Branch selectors
  selectCurrentBranchId,
  selectCurrentBranchName,
  selectRequiresBranchSelection
} from './store/auth-store';

// Constants
export { ROLES, PERMISSIONS, ROLE_DISPLAY_NAMES, hasHigherOrEqualRole } from './constants/auth.constants';
export type { UserRole, Permission } from './constants/auth.constants';
