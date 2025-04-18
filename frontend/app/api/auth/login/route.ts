import { NextRequest, NextResponse } from 'next/server';
import { serverAuth } from '@/features/auth/server/serverAuth';
import { LoginRequest } from '@/features/auth/types/authTypes';

/**
 * API роут для авторизації користувача
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Отримано запит на логін');

    // Отримуємо дані з запиту
    const credentials = (await request.json()) as LoginRequest;
    console.log('Отримані дані для логіну:', {
      username: credentials.username,
      password: '***',
    });

    // Перевіряємо наявність необхідних полів
    if (!credentials.username || !credentials.password) {
      console.log("Відсутні обов'язкові поля");
      return NextResponse.json(
        { message: "Логін та пароль обов'язкові" },
        { status: 400 }
      );
    }

    console.log('Викликаємо serverAuth.login');
    // Викликаємо функцію для логіну
    const userData = await serverAuth.login(credentials);
    console.log('Отримано відповідь від serverAuth.login', userData);

    // Повертаємо дані користувача
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Помилка авторизації:', error);
    console.error(
      'Деталі помилки:',
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error
    );

    // Повертаємо помилку
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Помилка авторизації',
      },
      { status: 401 }
    );
  }
}
