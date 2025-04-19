import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для пошуку клієнтів
 * Шлях: /api/clients/search
 * Метод: POST
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка POST запитів для пошуку клієнтів
 */
export async function POST(request: NextRequest) {
  try {
    // Отримуємо токен авторизації
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('Відсутній токен автентифікації');
      return NextResponse.json(
        { message: 'Необхідно авторизуватися' },
        { status: 401 }
      );
    }
    
    // Логуємо запит
    console.log('Пошук клієнтів: отримано запит');

    // Отримуємо параметри пошуку з тіла запиту
    const searchData = await request.json();
    console.log('Параметри пошуку клієнтів:', searchData);

    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на пошук клієнтів до ${SERVER_API_URL}/clients/search`);
    
    const response = await fetch(`${SERVER_API_URL}/clients/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(searchData)
    });
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при пошуку клієнтів: ${response.status}`);
      
      // Спробуємо отримати деталі помилки
      let errorData;
      try {
        errorData = await response.json();
        console.error('Деталі помилки від бекенду:', errorData);
      } catch (error) {
        errorData = { message: 'Не вдалося отримати деталі помилки' };
        console.error('Не вдалося отримати деталі помилки:', error);
      }
      
      return NextResponse.json(
        errorData || { message: 'Помилка при обробці запиту на сервері' },
        { status: response.status }
      );
    }
    
    // Отримуємо дані відповіді
    const clientsData = await response.json();
    console.log(`Знайдено ${clientsData.totalElements || 0} клієнтів`);
    
    // Повертаємо успішну відповідь
    return NextResponse.json(clientsData);
  } catch (error) {
    console.error('Помилка при пошуку клієнтів:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
