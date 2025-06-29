import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

import { JwtPayload, UserRole } from '@/features/auth/model/types';

// Маршрути, які потребують авторизації
const protectedRoutes = [
  '/dashboard',
  '/clients',
  '/orders',
  '/order-wizard',
  '/price-list',
  '/settings',
] as const;

// Публічні маршрути (не потребують авторизації)
const publicRoutes = ['/login', '/register'] as const;

// Перевірка, чи шлях є публічним
const isPublic = (path: string): boolean => {
  // Перевіряємо точний збіг або чи починається з публічного шляху
  if (publicRoutes.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))) {
    return true;
  }

  // Додаткова перевірка для API аутентифікації
  return path.startsWith('/api/auth/');
};

// Перевірка, чи токен є валідним
const isTokenValid = (token: string): boolean => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    // Перевіряємо, чи токен не прострочений
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error(
      'Error decoding token:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
};

// Перевірка, чи користувач має необхідну роль для доступу до маршруту
const hasRequiredRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Отримання ролі з токена
const getRoleFromToken = (token: string): UserRole | null => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.role;
  } catch (error) {
    console.error('Error getting role from token:', error);
    return null;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Перевіряємо наявність токена в cookies (якщо використовуємо cookies)
  // або пропускаємо перевірку для localStorage (клієнтська перевірка)

  // Якщо це публічний маршрут, дозволяємо доступ
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Якщо це захищений маршрут, перевіряємо авторизацію
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Тут можна додати перевірку токена в cookies
    // Наразі пропускаємо, оскільки використовуємо localStorage

    // Можливо, в майбутньому додамо роль-базовану перевірку:
    // const token = request.cookies.get('accessToken')?.value;
    // if (token && isTokenValid(token)) {
    //   const userRole = getRoleFromToken(token);
    //   // Перевірка ролей для конкретних маршрутів
    // }

    return NextResponse.next();
  }

  // Для кореневого маршруту перенаправляємо на dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
