'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';

// Маршрути, які потребують авторизації
const protectedRoutes = [
  '/dashboard',
  '/clients',
  '/orders',
  '/order-wizard',
  '/price-list',
  '/settings',
];

// Публічні маршрути (не потребують авторизації)
const publicRoutes = ['/login', '/register'];

/**
 * Компонент для захисту маршрутів від неавторизованих користувачів
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Даємо час AuthInitializer ініціалізуватися
    const timer = setTimeout(() => {
      console.log('🔄 AuthGuard: Ініціалізація завершена');
      setIsInitialized(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Не виконуємо перевірки поки не ініціалізувалися
    if (!isInitialized) {
      console.log('⏳ AuthGuard: Очікуємо ініціалізації...');
      return;
    }

    console.log('🔍 AuthGuard: Перевіряємо доступ:', { pathname, isLoggedIn, isInitialized });

    // Перевіряємо чи потрібна авторизація для поточного маршруту
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);

    console.log('🔍 AuthGuard: Типи маршрутів:', { isProtectedRoute, isPublicRoute });

    if (isProtectedRoute && !isLoggedIn) {
      // Якщо це захищений маршрут і користувач не залогінений
      console.log('🔒 Доступ заборонено, перенаправляємо на логін');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else if (isPublicRoute && isLoggedIn) {
      // Якщо це публічний маршрут і користувач вже залогінений
      console.log('✅ Користувач вже залогінений, перенаправляємо на dashboard');
      router.push('/dashboard');
    } else {
      console.log('✅ AuthGuard: Доступ дозволено');
    }
  }, [pathname, isLoggedIn, router, isInitialized]);

  return <>{children}</>;
}
