import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '@/features/auth/types';

interface JwtPayload {
  sub: string;
  exp: number;
  roles: UserRole[];
  username: string;
}

/**
 * Отримання токена з cookies на стороні сервера
 */
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    return token || null;
  } catch (error) {
    console.error('Помилка отримання токена на сервері:', error);
    return null;
  }
}

/**
 * Отримання даних з токена на стороні сервера
 */
export async function getTokenData(): Promise<JwtPayload | null> {
  try {
    const token = await getServerToken();

    if (!token) {
      return null;
    }

    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Помилка декодування токена:', error);
    return null;
  }
}

/**
 * Перевірка автентифікації на стороні сервера
 */
export async function isAuthenticated(): Promise<boolean> {
  const data = await getTokenData();
  return !!data;
}

/**
 * Перевірка дійсності токена (не простроченого)
 */
export async function isValidToken(): Promise<boolean> {
  const data = await getTokenData();
  if (!data) return false;
  return data.exp * 1000 > Date.now();
}

/**
 * Перевірка наявності ролі на стороні сервера
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const data = await getTokenData();
  if (!data || !data.roles) return false;
  return data.roles.includes(role);
}

/**
 * Перевірка наявності ролі адміністратора
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(UserRole.ADMIN);
}

/**
 * Перевірка наявності ролі менеджера
 */
export async function isManager(): Promise<boolean> {
  const data = await getTokenData();
  if (!data || !data.roles) return false;
  return (
    data.roles.includes(UserRole.MANAGER) || data.roles.includes(UserRole.ADMIN)
  );
}

/**
 * Перевірка наявності ролі працівника
 */
export async function isStaff(): Promise<boolean> {
  const data = await getTokenData();
  if (!data || !data.roles) return false;
  return (
    data.roles.includes(UserRole.STAFF) ||
    data.roles.includes(UserRole.MANAGER) ||
    data.roles.includes(UserRole.ADMIN)
  );
}
