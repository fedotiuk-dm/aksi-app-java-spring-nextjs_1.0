import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '@/features/auth/types';

// Публічні маршрути, які не потребують автентифікації
const publicRoutes = ['/login', '/api/auth/login'];

// Маршрути доступні тільки для адміністратора
const adminRoutes = ['/admin', '/settings'];

// Маршрути для менеджерів та адміністраторів
const managerRoutes = ['/analytics', '/reports', '/pricelist'];

interface JwtPayload {
  sub: string;
  exp: number;
  roles: UserRole[];
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Перевірка чи маршрут публічний
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Отримання токена з cookies
  const token = request.cookies.get('token')?.value;

  // Якщо токен відсутній, перенаправляємо на логін
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Декодування JWT та перевірка терміну дії
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Токен протермінований, перенаправляємо на логін
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Перевірка прав доступу для адмін-маршрутів
    if (
      adminRoutes.some((route) => path.startsWith(route)) &&
      !decoded.roles.includes(UserRole.ADMIN)
    ) {
      // Користувач намагається отримати доступ до адмін-маршруту без відповідних прав
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Перевірка прав доступу для менеджер-маршрутів
    if (
      managerRoutes.some((route) => path.startsWith(route)) &&
      !decoded.roles.includes(UserRole.MANAGER) &&
      !decoded.roles.includes(UserRole.ADMIN)
    ) {
      // Користувач намагається отримати доступ до маршруту менеджера без відповідних прав
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // Помилка декодування токена
    console.error('Помилка декодування токена:', error);
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Вказуємо для яких маршрутів застосовувати middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
