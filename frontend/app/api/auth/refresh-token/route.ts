import { NextResponse } from 'next/server';
import { serverAuth } from '@/features/auth/server/serverAuth';

/**
 * API роут для оновлення токена доступу
 * POST /api/auth/refresh-token
 */
export async function POST() {
  try {
    // Оновлюємо токен через serverAuth
    const user = await serverAuth.refreshToken();
    
    // Якщо не вдалося оновити токен
    if (!user) {
      return NextResponse.json(
        { message: 'Не вдалося оновити токен авторизації' },
        { status: 401 }
      );
    }
    
    // Токени вже оновлені в cookies через serverAuth.refreshToken
    
    // Повертаємо дані користувача
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error('Помилка при оновленні токена:', error);
    
    // Повертаємо помилку з відповідним статус-кодом
    return NextResponse.json(
      { message: (error as Error).message || 'Помилка при оновленні токена' },
      { status: 401 }
    );
  }
}
