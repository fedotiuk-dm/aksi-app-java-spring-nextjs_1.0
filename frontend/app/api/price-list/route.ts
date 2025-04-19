import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи з прайс-листом
 * Шлях: /api/price-list
 * Методи:
 * - GET - отримання списку категорій послуг з їх позиціями
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка GET запитів для отримання прайс-листа
 */
export async function GET() {
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
    console.log('Отримання прайс-листа: запит розпочато');
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/price-list`;
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на отримання прайс-листа до ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Детальне логування всіх запитів/відповідей для дебагу
    console.log(`Відповідь від бекенду отримана, статус: ${response.status}`);
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при отриманні прайс-листа: ${response.status}`);
      
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
    const data = await response.json();
    console.log('\u041f\u0440\u0430\u0439\u0441-\u043b\u0438\u0441\u0442 \u0443\u0441\u043f\u0456\u0448\u043d\u043e \u043e\u0442\u0440\u0438\u043c\u0430\u043d\u043e');
      
    // Логуємо структуру даних для розуміння проблеми
    try {
      const dataStr = JSON.stringify(data, null, 2);
      console.log('Структура даних прайс-листа:', dataStr.substring(0, 500) + '...');
      
      // Перевіряємо, чи є категорії та їх елементи
      if (data && Array.isArray(data)) {
        for (const category of data) {
          if (category.items && Array.isArray(category.items) && category.items.length > 0) {
            const item = category.items[0];
            console.log('Приклад елемента прайс-листа:', JSON.stringify(item, null, 2));
            break;
          }
        }
      }
    } catch (err) {
      console.error('Помилка при логуванні даних:', err);
    }
      
    return NextResponse.json(data);
  } catch (error) {
    console.error('Помилка при отриманні прайс-листа:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
