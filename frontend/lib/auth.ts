'use client';

import { jwtDecode } from 'jwt-decode';
import { UserRole } from '@/features/auth/types';

// Типи
export interface JwtPayload {
  sub: string;
  exp: number;
  roles: UserRole[];
  username: string;
}

// Клієнтські функції для роботи з cookies
export function setClientToken(token: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = `token=${token}; path=/; max-age=${
    60 * 60 * 24 * 7
  }; secure; samesite=strict`;
}

export function getClientToken(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
}

export function removeClientToken(): void {
  if (typeof window === 'undefined') return;
  document.cookie = 'token=; path=/; max-age=0';
}

// Функція для отримання даних з токена
export function getTokenData(token: string): JwtPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function isValidToken(token: string): boolean {
  if (!token) return false;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Допоміжні функції для перевірки прав
export function hasRequiredRole(
  roles: UserRole[],
  requiredRole: UserRole
): boolean {
  return roles.includes(requiredRole);
}

export function isAdmin(roles: UserRole[]): boolean {
  return hasRequiredRole(roles, UserRole.ADMIN);
}

export function isManager(roles: UserRole[]): boolean {
  return hasRequiredRole(roles, UserRole.MANAGER) || isAdmin(roles);
}

export function isStaff(roles: UserRole[]): boolean {
  return hasRequiredRole(roles, UserRole.STAFF) || isManager(roles);
}
