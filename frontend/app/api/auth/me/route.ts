import { NextResponse } from 'next/server';
import { serverAuth } from '@/features/auth/server/serverAuth';

/**
 * API роут для отримання інформації про поточного користувача
 * GET /api/auth/me
 */
export async function GET() {
  try {
    // Отримуємо інформацію про користувача через serverAuth
    const user = await serverAuth.getCurrentUser();
    
    // Якщо користувач не авторизований
    if (!user) {
      return NextResponse.json(
        { message: 'Користувач не авторизований' },
        { status: 401 }
      );
    }
    
    // Повертаємо дані користувача
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error('Помилка при отриманні інформації про користувача:', error);
    
    // Повертаємо помилку з відповідним статус-кодом
    return NextResponse.json(
      { message: (error as Error).message || 'Помилка при отриманні інформації про користувача' },
      { status: 401 }
    );
  }
}
