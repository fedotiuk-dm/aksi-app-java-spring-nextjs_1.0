import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи з категоріями прайс-листа
 * Шлях: /api/price-list/category
 * Методи:
 * - POST - створення нової категорії послуг
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка POST запитів для створення нової категорії послуг
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
    
    // Отримуємо дані запиту
    const categoryData = await request.json();
    console.log('Створення нової категорії послуг:', categoryData.name);
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/price-list/category`;
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на створення категорії до ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(categoryData)
    });
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при створенні категорії: ${response.status}`);
      
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
    const createdCategory = await response.json();
    console.log(`Створено нову категорію з ID: ${createdCategory.id}`);
    
    // Повертаємо успішну відповідь
    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error('Помилка при створенні категорії:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
