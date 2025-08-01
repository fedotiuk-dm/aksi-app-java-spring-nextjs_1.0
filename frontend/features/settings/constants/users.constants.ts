/**
 * @fileoverview Users management constants
 */

export const USERS_PAGE_SIZES = [5, 10, 25, 50] as const;

export const USER_STATUS_OPTIONS = [
  { value: '', label: 'Всі статуси' },
  { value: 'true', label: 'Активні' },
  { value: 'false', label: 'Неактивні' },
] as const;

export const USER_TABLE_COLUMNS = {
  USER: 'user',
  EMAIL: 'email',
  ROLES: 'roles',
  BRANCH: 'branch',
  STATUS: 'status',
  LAST_ACTIVITY: 'lastActivity',
  ACTIONS: 'actions',
} as const;

export const USER_DIALOG_TYPES = {
  CREATE: 'create',
  EDIT: 'edit',
  CHANGE_PASSWORD: 'changePassword',
  CHANGE_ROLES: 'changeRoles',
  MANAGE_BRANCHES: 'manageBranches',
} as const;

export type UserDialogType = typeof USER_DIALOG_TYPES[keyof typeof USER_DIALOG_TYPES];