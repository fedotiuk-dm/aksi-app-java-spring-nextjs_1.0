import { NextRequest, NextResponse } from 'next/server';

import { serverAuth } from '@/features/auth/server/serverAuth';

/**
 * API роут для логіну користувача
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    // Отримуємо дані з запиту
    const credentials = await request.json();

    // Виконуємо логін через serverAuth
    const user = await serverAuth.login(credentials);

    // Токени вже встановлені в cookies через serverAuth.login

    // Повертаємо дані користувача
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error('Помилка при вході в систему:', error);

    // Повертаємо помилку з відповідним статус-кодом
    return NextResponse.json(
      { message: (error as Error).message || 'Помилка при вході в систему' },
      { status: 401 }
    );
  }
}
