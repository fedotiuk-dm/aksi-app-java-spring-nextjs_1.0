import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload, UserRole } from './features/auth/types/authTypes';

// Публічні шляхи, які не потребують автентифікації
const publicPaths = [
  '/login', 
  '/register', 
  '/api/auth/login', 
  '/api/auth/register',
  '/api/auth/refresh-token'
];

// Перевірка, чи шлях є публічним
const isPublic = (path: string) => {
  // Перевіряємо точний збіг або чи починається з публічного шляху
  if (publicPaths.some(publicPath => path === publicPath || path.startsWith(`${publicPath}/`))) {
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
    console.error('Error decoding token:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};

export async function middleware(request: NextRequest) {
  // Отримуємо шлях
  const path = request.nextUrl.pathname;
  
  // Якщо шлях публічний, пропускаємо без перевірки
  if (isPublic(path)) {
    return NextResponse.next();
  }

  // Статичні файли пропускаємо без перевірки
  if (path.startsWith('/_next') || 
      path.includes('/static/') || 
      path.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
    return NextResponse.next();
  }
  
  // Отримуємо токен з cookies
  const authToken = request.cookies.get('auth_token')?.value;

  // Якщо токен відсутній або невалідний, перенаправляємо на сторінку логіну
  if (!authToken || !isTokenValid(authToken)) {
    // Якщо це API запит, повертаємо помилку "Unauthorized"
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'Необхідно авторизуватися' },
        { status: 401 }
      );
    }
    
    // Інакше, перенаправляємо на сторінку логіну з вказанням callback URL
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  // Отримуємо інформацію про користувача з токена
  try {
    const payload = jwtDecode<JwtPayload>(authToken);
    const userRole = payload.role || UserRole.USER; // Використовуємо імпортований UserRole
    
    // Можна додати додаткові перевірки доступу за роллю
    // Наприклад, перевірити, чи має користувач доступ до адмін. розділу
    if (path.startsWith('/admin') && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error('Error processing token in middleware:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Якщо користувач автентифікований, продовжуємо
  return NextResponse.next();
}
