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

// Operations Hooks
export { useAuthOperations } from './hooks/useAuthOperations';
export { useAuthLoginOperations } from './hooks/useAuthLoginOperations';
export { useAuthLogoutOperations } from './hooks/useAuthLogoutOperations';
export { useAuthTokenOperations } from './hooks/useAuthTokenOperations';
export { useAuthPasswordOperations } from './hooks/useAuthPasswordOperations';
export { useAuthSelectors } from './hooks/useAuthSelectors';

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
  // Permission selectors
  selectPermissions,
  selectHasPermission,
  // Branch selectors
  selectCurrentBranchId,
  selectCurrentBranchName,
  selectRequiresBranchSelection,
} from './store/auth-store';

// Utils
export {
  getUserDisplayName,
  shouldRedirectToBranchSelection,
  getRedirectUrl,
  hasValidBranchId,
  getErrorMessage,
} from './utils/auth.utils';

// Constants
export {
  ROLES,
  PERMISSIONS,
  ROLE_DISPLAY_NAMES,
  hasHigherOrEqualRole,
} from './constants/auth.constants';
export type { UserRole, Permission } from './constants/auth.constants';
