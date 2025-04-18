import { NextResponse } from 'next/server';
import { serverAuth } from '@/features/auth/server/serverAuth';

/**
 * API роут для отримання інформації про поточного користувача
 */
export async function GET() {
  try {
    // Отримуємо інформацію про поточного користувача
    const user = serverAuth.getCurrentUser();
    
    // Якщо користувач не авторизований, повертаємо помилку
    if (!user) {
      return NextResponse.json(
        { message: 'Користувач не авторизований' },
        { status: 401 }
      );
    }
    
    // Повертаємо дані користувача
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Помилка отримання інформації про користувача:', error);
    
    // Повертаємо помилку
    return NextResponse.json(
      { message: 'Помилка отримання інформації про користувача' },
      { status: 500 }
    );
  }
}
