import { NextResponse } from 'next/server';
import { serverAuth } from '@/features/auth/server/serverAuth';

/**
 * API роут для оновлення JWT токена
 */
export async function POST() {
  try {
    // Викликаємо функцію для оновлення токена
    const userData = await serverAuth.refreshToken();
    
    // Якщо оновлення не вдалося, повертаємо помилку
    if (!userData) {
      return NextResponse.json(
        { message: 'Не вдалося оновити токен' },
        { status: 401 }
      );
    }
    
    // Повертаємо дані користувача
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Помилка оновлення токена:', error);
    
    // Повертаємо помилку
    return NextResponse.json(
      { message: 'Помилка оновлення токена, необхідно увійти знову' },
      { status: 401 }
    );
  }
}
