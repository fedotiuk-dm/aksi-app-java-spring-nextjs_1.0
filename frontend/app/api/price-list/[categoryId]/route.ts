import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи з категорією прайс-листа
 * Шлях: /api/price-list/[categoryId]
 * Методи:
 * - GET - отримання категорії послуг за ідентифікатором
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка GET запитів для отримання категорії прайс-листа за ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    // Отримуємо ID категорії з параметрів шляху
    const { categoryId } = params;
    
    if (!categoryId) {
      return NextResponse.json(
        { message: 'Необхідно вказати ID категорії' },
        { status: 400 }
      );
    }
    
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
    console.log(`Отримання категорії прайс-листа за ID: ${categoryId}`);
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/price-list/${categoryId}`;
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на отримання категорії за ID до ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при отриманні категорії: ${response.status}`);
      
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
    const categoryData = await response.json();
    console.log(`Отримано категорію: ${categoryData.name}`);
    
    // Повертаємо успішну відповідь
    return NextResponse.json(categoryData);
  } catch (error) {
    console.error('Помилка при отриманні категорії прайс-листа:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
