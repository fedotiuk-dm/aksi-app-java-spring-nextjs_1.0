/**
 * @fileoverview Типи та адаптери для auth feature
 *
 * Містить:
 * - Локальні типи для auth feature (синхронізовані з API)
 * - Адаптери для Orval згенерованих типів
 * - Утиліти для конвертації даних
 */

import type {
  AuthResponse,
  UserResponse,
  UserResponseRolesItem,
} from '@/shared/api/generated/auth';

/**
 * Інтерфейс для даних користувача (синхронізовано з API)
 */
export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  position?: string;
}

/**
 * Ролі користувача (синхронізовано з API UserResponseRolesItem)
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  CASHIER = 'CASHIER',
  OPERATOR = 'OPERATOR',
}

/**
 * Інтерфейс для помилок автентифікації
 */
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Тип JWT Payload
 */
export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  role: UserRole;
  name: string;
  email: string;
}

/**
 * Конвертує API роль в локальну роль
 */
export const convertApiRoleToUserRole = (apiRole: UserResponseRolesItem): UserRole => {
  // API та локальні ролі тепер синхронізовані, тому просто кастимо
  return apiRole as UserRole;
};

/**
 * Конвертує API UserResponse в AuthUser для внутрішнього використання
 */
export const convertUserResponseToAuthUser = (userResponse: UserResponse): AuthUser => {
  return {
    id: userResponse.id,
    username: userResponse.username,
    name: `${userResponse.firstName} ${userResponse.lastName}`.trim(),
    email: userResponse.email,
    role: convertApiRoleToUserRole(userResponse.roles[0]), // Беремо першу роль
    position: undefined, // API не повертає position
  };
};

/**
 * Адаптер для конвертації API AuthResponse в AuthUser
 */
export const adaptAuthResponseToAuthUser = (response: AuthResponse): AuthUser => {
  console.log('🔄 Адаптуємо API auth response:', response);
  return convertUserResponseToAuthUser(response.user);
};

/**
 * Перевіряє чи є користувач адміністратором
 */
export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === UserRole.ADMIN;
};

/**
 * Перевіряє чи є користувач менеджером або адміністратором
 */
export const isManagerOrAdmin = (user: AuthUser | null): boolean => {
  return user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN;
};

/**
 * Перевіряє чи може користувач працювати з касою
 */
export const canHandleCash = (user: AuthUser | null): boolean => {
  return (
    user?.role === UserRole.CASHIER ||
    user?.role === UserRole.MANAGER ||
    user?.role === UserRole.ADMIN
  );
};

/**
 * Перевіряє чи може користувач приймати замовлення
 */
export const canTakeOrders = (user: AuthUser | null): boolean => {
  return user?.role !== UserRole.CASHIER; // Всі крім касира
};

/**
 * Отримує відображуване ім'я ролі
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Адміністратор';
    case UserRole.MANAGER:
      return 'Менеджер';
    case UserRole.EMPLOYEE:
      return 'Співробітник';
    case UserRole.CASHIER:
      return 'Касир';
    case UserRole.OPERATOR:
      return 'Оператор';
    default:
      return 'Невідома роль';
  }
};

// Експортуємо API типи для зручності
export type { AuthResponse, UserResponse, UserResponseRolesItem };
