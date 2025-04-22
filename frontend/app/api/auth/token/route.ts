import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API роут для отримання JWT токена для клієнтських OpenAPI запитів
 * GET /api/auth/token
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: 'Не знайдено токен авторизації' },
        { status: 401 }
      );
    }

    // Повертаємо токен у безпечному форматі
    return NextResponse.json({ token: authToken });
  } catch (error) {
    console.error('Помилка при отриманні токена:', error);
    return NextResponse.json(
      { message: 'Помилка при отриманні токена авторизації' },
      { status: 500 }
    );
  }
}
