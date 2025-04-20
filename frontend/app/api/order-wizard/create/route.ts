import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для створення замовлення через OrderWizard
 * Шлях: /api/order-wizard/create
 * Методи:
 * - POST - створення нового замовлення
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка POST запитів для створення нового замовлення
 */
export async function POST(request: Request) {
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
    
    // Отримуємо дані замовлення з запиту
    const orderData = await request.json();
    
    // Логуємо запит
    console.log('Створення замовлення: запит розпочато');
    console.log('Дані замовлення:', JSON.stringify(orderData, null, 2));
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/orders`;
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на створення замовлення до ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(orderData)
    });
    
    // Обробка помилок
    if (!response.ok) {
      // Отримуємо детальний опис помилки
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = JSON.stringify(errorData);
      } catch {
        errorDetail = await response.text();
      }
      
      console.error(`Помилка створення замовлення. Статус: ${response.status}, деталі: ${errorDetail}`);
      
      return NextResponse.json(
        { 
          message: 'Помилка при створенні замовлення', 
          status: response.status,
          detail: errorDetail
        },
        { status: response.status }
      );
    }
    
    // Отримуємо результат
    const result = await response.json();
    console.log('Замовлення успішно створено:', JSON.stringify(result, null, 2));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Непередбачена помилка при створенні замовлення:', error);
    return NextResponse.json(
      { message: 'Щось пішло не так при створенні замовлення' },
      { status: 500 }
    );
  }
}
