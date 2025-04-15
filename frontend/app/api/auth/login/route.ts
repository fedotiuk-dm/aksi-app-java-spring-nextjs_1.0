import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

// Допоміжна функція для логування з часовою міткою
function logWithTimestamp(message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] LOGIN_API: ${message}`, data || '');
}

export async function POST(request: Request) {
  logWithTimestamp('Запит на логін отримано');

  try {
    const { username, password } = await request.json();

    logWithTimestamp('Спроба логіну користувача', { username });

    // Перевіряємо наявність базового URL
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseApiUrl) {
      logWithTimestamp('NEXT_PUBLIC_API_URL не налаштований');
      throw new Error('API URL не налаштований. Перевірте .env.local файл.');
    }

    // Формуємо повний URL включно з базовим URL API та шляхом
    // Конфігуруємо прямий URL для тестування
    const apiUrl = `${baseApiUrl}/auth/login`;
    logWithTimestamp('Надсилаємо запит на URL', apiUrl);

    // Виводимо .env.local змінні для діагностики
    logWithTimestamp('Змінні оточення', {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    });

    // Додаємо явно заголовки для CORS та більше діагностичної інформації
    try {
      logWithTimestamp('Надсилаємо запит до API');

      const response = await axios.post(
        apiUrl,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Origin: 'http://localhost:3000',
          },
        }
      );

      // Логування відповіді
      logWithTimestamp('Отримано відповідь від сервера');
      logWithTimestamp('Код відповіді', response.status);
      logWithTimestamp('Заголовки відповіді', response.headers);
      logWithTimestamp('Дані відповіді', response.data);

      // Визначаємо, яке поле використовується для токена
      const token = response.data.accessToken || response.data.token;
      logWithTimestamp('Токен отримано', { tokenExists: !!token });

      const user = response.data.user || response.data;
      logWithTimestamp('Дані користувача', user);

      if (!token) {
        logWithTimestamp('ПОМИЛКА: Не знайдено токен у відповіді API');
        return NextResponse.json(
          { message: 'Помилка автентифікації: невірний формат відповіді' },
          { status: 500 }
        );
      }

      // Встановлюємо токен в cookie
      const cookieStore = await cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 днів
        path: '/',
        sameSite: 'strict',
      });
      logWithTimestamp('Cookie встановлено успішно');

      // Повертаємо результат без токена (він вже в cookie)
      logWithTimestamp('Відправляємо успішну відповідь клієнту');
      return NextResponse.json({ user });
    } catch (axiosError: unknown) {
      const error = axiosError as {
        message?: string;
        response?: {
          status?: number;
          data?: unknown;
          headers?: unknown;
        };
      };

      logWithTimestamp('ПОМИЛКА запиту до API', error.message);
      logWithTimestamp('Деталі запиту', {
        url: apiUrl,
        request: { username, password: '***' },
      });

      if (error.response) {
        logWithTimestamp('Статус помилки', error.response.status);
        logWithTimestamp('Заголовки відповіді', error.response.headers);
        logWithTimestamp('Дані помилки', error.response.data);
      }

      throw axiosError;
    }
  } catch (error: unknown) {
    logWithTimestamp('КРИТИЧНА ПОМИЛКА автентифікації', error);

    const axiosError = error as {
      response?: {
        status?: number;
        data?: { message?: string; error?: string };
      };
      message?: string;
    };

    // Повертаємо помилку від API або стандартну помилку
    const statusCode = axiosError.response?.status || 500;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Помилка автентифікації';

    logWithTimestamp('Відправляємо відповідь з помилкою клієнту', {
      statusCode,
      message,
    });

    return NextResponse.json(
      { message, error: axiosError.response?.data?.error || 'Unauthorized' },
      { status: statusCode }
    );
  }
}
