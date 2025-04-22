import { NextResponse } from 'next/server';
import { serverAuth } from '@/features/auth/server/serverAuth';

/**
 * API роут для виходу користувача з системи
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    // Виконуємо вихід через serverAuth
    await serverAuth.logout();
    
    // Повертаємо успішну відповідь
    return NextResponse.json({ message: 'Успішний вихід із системи' });
  } catch (error: unknown) {
    console.error('Помилка при виході з системи:', error);
    
    // Повертаємо помилку з відповідним статус-кодом
    return NextResponse.json(
      { message: (error as Error).message || 'Помилка при виході з системи' },
      { status: 500 }
    );
  }
}
