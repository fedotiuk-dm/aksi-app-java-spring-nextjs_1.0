/**
 * @fileoverview Auth utility functions
 * Helper functions for user display names, redirects, and common auth operations
 */

import type { LoginResponse } from '@/shared/api/generated/auth';

/**
 * Get user display name from login response
 * @param user - Login response from API
 * @returns Display name for the user
 */
export const getUserDisplayName = (user: LoginResponse): string => {
  return user.firstName || user.username || 'User';
};

/**
 * Check if user should be redirected to branch selection
 * @param user - Login response from API
 * @returns True if branch selection is required
 */
export const shouldRedirectToBranchSelection = (user: LoginResponse): boolean => {
  if (!user.requiresBranchSelection) return false;
  return !user.branchId || (typeof user.branchId === 'object' && !user.branchId.present);
};

/**
 * Get redirect URL from query parameters or default to dashboard
 * @returns Redirect URL
 */
export const getRedirectUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  return params.get('callbackUrl') || '/dashboard';
};

/**
 * Check if branch ID is present and valid
 * @param branchId - Branch ID from user data (string or JsonNullable)
 * @returns True if branch ID is valid
 */
export const hasValidBranchId = (
  branchId: string | { present: boolean } | undefined | null
): boolean => {
  if (!branchId) return false;
  if (typeof branchId === 'string') return true;
  if (typeof branchId === 'object' && 'present' in branchId) {
    return branchId.present === true;
  }
  return false;
};

/**
 * Get error message from API error response
 * @param error - Error object from API call
 * @param defaultMessage - Default message if error parsing fails
 * @returns Error message string
 */
export const getErrorMessage = (
  error: { response?: { data?: { message?: string } } } | null | undefined,
  defaultMessage: string = 'An error occurred'
): string => {
  return error?.response?.data?.message || defaultMessage;
};
