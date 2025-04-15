import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { API_ROUTES } from '@/constants';

export async function POST() {
  try {
    // Отримуємо токен з cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
      // Відправляємо запит на бекенд для логаута
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.AUTH.LOGOUT}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    // Видаляємо токен з cookies
    cookieStore.delete('token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Помилка виходу з системи:', error);

    // Видаляємо токен в будь-якому випадку
    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.json({
      success: true,
      message: 'Вихід виконано успішно, незважаючи на помилку на сервері',
    });
  }
}
