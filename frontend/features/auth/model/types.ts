/**
 * @fileoverview Типи та адаптери для auth feature
 *
 * Містить:
 * - Локальні типи для auth feature
 * - Адаптери для Orval згенерованих типів
 * - Утиліти для конвертації даних
 */

import type { AuthLogin200, AuthRegister200 } from '@/shared/api/generated/auth';

/**
 * Інтерфейс для відповіді автентифікації з API
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  position?: string;
}

/**
 * Інтерфейс для даних користувача
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
 * Ролі користувача
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
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

// 🔄 Базовий адаптер для конвертації API відповіді в AuthUser
const createAuthUserFromApiResponse = (data: unknown): AuthUser => {
  if (!data) {
    throw new Error('Отримано порожні дані користувача від сервера');
  }

  const apiData = data as Record<string, unknown>;

  return {
    id: (apiData.id as string) || (apiData.userId as string) || 'unknown',
    username: (apiData.username as string) || 'unknown',
    name: (apiData.name as string) || (apiData.fullName as string) || 'Unknown User',
    email: (apiData.email as string) || 'unknown@example.com',
    role: (apiData.role as UserRole) || UserRole.STAFF,
    position: apiData.position as string,
  };
};

/**
 * Конвертує AuthResponse від API в AuthUser для внутрішнього використання
 */
export const convertToAuthUser = (response: AuthResponse): AuthUser => {
  if (!response.id || !response.username || !response.name || !response.email || !response.role) {
    throw new Error('Отримано неповні дані користувача від сервера');
  }

  return {
    id: response.id,
    username: response.username,
    name: response.name,
    email: response.email,
    role: response.role as unknown as UserRole,
    position: response.position ?? undefined,
  };
};

/**
 * Адаптер для конвертації Orval AuthLogin200 в AuthUser
 */
export const adaptOrvalLoginResponse = (response: AuthLogin200): AuthUser => {
  console.log('🔄 Адаптуємо Orval login response:', response);

  // Зберігаємо токен в localStorage якщо він є
  const apiData = response as Record<string, unknown>;
  if (apiData.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('auth-token', apiData.accessToken as string);
    console.log('💾 Токен збережено в localStorage:', apiData.accessToken);
  } else {
    console.warn('⚠️ Токен не знайдено в response:', apiData);
  }

  return createAuthUserFromApiResponse(response);
};

/**
 * Адаптер для конвертації Orval AuthRegister200 в AuthUser
 */
export const adaptOrvalRegisterResponse = (response: AuthRegister200): AuthUser => {
  console.log('🔄 Адаптуємо Orval register response:', response);
  return createAuthUserFromApiResponse(response);
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
 * Отримує відображуване ім'я ролі
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Адміністратор';
    case UserRole.MANAGER:
      return 'Менеджер';
    case UserRole.STAFF:
      return 'Співробітник';
    default:
      return 'Невідома роль';
  }
};
