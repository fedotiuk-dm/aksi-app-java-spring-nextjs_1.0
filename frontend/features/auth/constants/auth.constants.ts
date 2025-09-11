/**
 * @fileoverview Auth constants and enums
 * All constants are in English for consistency
 */

// Import generated role types from user API (single source of truth)
import { UserDetailRolesItem } from '@/shared/api/generated/user';

// Re-export roles from generated API for convenience
export const ROLES = UserDetailRolesItem;

// Type for role
export type UserRole = (typeof UserDetailRolesItem)[keyof typeof UserDetailRolesItem];

// Permissions constants - all user-facing operations
export const PERMISSIONS = {
  // User management permissions
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  VIEW_USERS: 'VIEW_USERS',

  // Order management permissions
  CREATE_ORDER: 'CREATE_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  VIEW_ORDERS: 'VIEW_ORDERS',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  UPDATE_DELIVERY_STATUS: 'UPDATE_DELIVERY_STATUS',

  // Customer management permissions
  CREATE_CUSTOMER: 'CREATE_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  VIEW_CUSTOMERS: 'VIEW_CUSTOMERS',

  // Branch management permissions
  MANAGE_BRANCHES: 'MANAGE_BRANCHES',

  // Reports and billing permissions
  VIEW_REPORTS: 'VIEW_REPORTS',
  MANAGE_BILLING: 'MANAGE_BILLING',
} as const;

// Type for permission
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.OPERATOR]: 'Operator',
  [ROLES.CLEANER]: 'Cleaner',
  [ROLES.DRIVER]: 'Driver',
};

// Role hierarchy for comparison (higher number = higher privilege)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.ADMIN]: 100,
  [ROLES.MANAGER]: 80,
  [ROLES.OPERATOR]: 40,
  [ROLES.CLEANER]: 20,
  [ROLES.DRIVER]: 20,
};

// Helper to check if user has higher or equal role privileges
export const hasHigherOrEqualRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
