import { NextRequest, NextResponse } from 'next/server';

// Маршрути, які потребують авторизації
const protectedRoutes = [
  '/dashboard',
  '/clients', 
  '/orders',
  '/order-wizard',
  '/price-list',
  '/settings',
  '/admin',
] as const;

// Публічні маршрути (не потребують авторизації)
const publicRoutes = ['/login'] as const;

// API роути, що не потребують перевірки
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/refresh-token',
  '/api/auth/logout',
] as const;

// Перевірка, чи шлях є публічним
const isPublic = (path: string): boolean => {
  // Перевіряємо точний збіг або чи починається з публічного шляху
  if (publicRoutes.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))) {
    return true;
  }

  // Перевірка для публічних API роутів
  return publicApiRoutes.some((apiRoute) => path === apiRoute);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Якщо це публічний маршрут, дозволяємо доступ
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Перевіряємо наявність auth cookies
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  // Якщо це захищений маршрут
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Якщо немає токенів - перенаправляємо на логін
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Якщо є тільки refresh token - дозволяємо запит 
    // (axios interceptor спробує оновити токен)
    if (!accessToken && refreshToken) {
      return NextResponse.next();
    }
  }

  // Для кореневого маршруту перенаправляємо на dashboard
  if (pathname === '/') {
    // Перевіряємо авторизацію
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
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
