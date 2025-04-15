'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../types';

interface JwtPayload {
  sub: string;
  exp: number;
  roles: UserRole[];
  username: string;
}

/**
 * Отримання токена з cookies
 */
export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

/**
 * Отримання даних сесії користувача
 */
export async function getServerSession(): Promise<JwtPayload | null> {
  try {
    const token = await getServerToken();
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

/**
 * Перевірка, чи користувач автентифікований
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session;
}

/**
 * Перевірка, чи користувач має певну роль
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getServerSession();
  if (!session || !session.roles) return false;

  return session.roles.includes(role);
}

/**
 * Перевірка, чи користувач є адміністратором
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(UserRole.ADMIN);
}

/**
 * Перевірка, чи користувач є менеджером або адміністратором
 */
export async function isManager(): Promise<boolean> {
  const session = await getServerSession();
  if (!session || !session.roles) return false;

  return (
    session.roles.includes(UserRole.MANAGER) ||
    session.roles.includes(UserRole.ADMIN)
  );
}

/**
 * Перевірка, чи користувач є працівником (має будь-яку роль)
 */
export async function isStaff(): Promise<boolean> {
  const session = await getServerSession();
  if (!session || !session.roles) return false;

  return session.roles.length > 0;
}

/**
 * Вихід з системи (видалення токена)
 */
export async function serverLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}
