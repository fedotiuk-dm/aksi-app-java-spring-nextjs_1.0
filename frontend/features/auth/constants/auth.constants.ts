/**
 * @fileoverview Auth constants and enums
 */

// Import generated role types from user API (single source of truth)
import { UserDetailRolesItem } from '@/shared/api/generated/user';

// Re-export roles from generated API for convenience
export const ROLES = UserDetailRolesItem;

// Type for role
export type UserRole = typeof UserDetailRolesItem[keyof typeof UserDetailRolesItem];

// Permissions constants
export const PERMISSIONS = {
  // User management
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  VIEW_USERS: 'VIEW_USERS',
  
  // Order management
  CREATE_ORDER: 'CREATE_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  VIEW_ORDERS: 'VIEW_ORDERS',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  UPDATE_DELIVERY_STATUS: 'UPDATE_DELIVERY_STATUS',
  
  // Customer management
  CREATE_CUSTOMER: 'CREATE_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  VIEW_CUSTOMERS: 'VIEW_CUSTOMERS',
  
  // Branch management
  MANAGE_BRANCHES: 'MANAGE_BRANCHES',
  
  // Reports and billing
  VIEW_REPORTS: 'VIEW_REPORTS',
  MANAGE_BILLING: 'MANAGE_BILLING',
} as const;

// Type for permission
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [ROLES.ADMIN]: 'Адміністратор',
  [ROLES.MANAGER]: 'Менеджер',
  [ROLES.OPERATOR]: 'Оператор',
  [ROLES.CLEANER]: 'Працівник цеху',
  [ROLES.DRIVER]: 'Водій',
  [ROLES.ACCOUNTANT]: 'Бухгалтер',
};

// Role hierarchy for comparison
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.ADMIN]: 100,
  [ROLES.MANAGER]: 80,
  [ROLES.ACCOUNTANT]: 60,
  [ROLES.OPERATOR]: 40,
  [ROLES.CLEANER]: 20,
  [ROLES.DRIVER]: 20,
};

// Helper to check if user has higher or equal role
export const hasHigherOrEqualRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};