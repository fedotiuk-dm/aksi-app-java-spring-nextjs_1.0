import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для розрахунку вартості послуг у OrderWizard
 * Шлях: /api/order-wizard/calculate
 * Методи:
 * - POST - розрахунок вартості послуг
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка POST запитів для розрахунку вартості послуг
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
    
    // Отримуємо дані послуг для розрахунку з запиту
    const serviceData = await request.json();
    
    // Логуємо запит
    console.log('Розрахунок вартості послуг: запит розпочато');
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/orders/calculate`;
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на розрахунок вартості до ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(serviceData)
    });
    
    // Обробка помилок
    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = JSON.stringify(errorData);
      } catch {
        // Перехоплюємо помилку розбору JSON та отримуємо текст помилки
        errorDetail = await response.text();
      }
      
      console.error(`Помилка розрахунку вартості. Статус: ${response.status}, деталі: ${errorDetail}`);
      
      return NextResponse.json(
        { 
          message: 'Помилка при розрахунку вартості', 
          status: response.status,
          detail: errorDetail
        },
        { status: response.status }
      );
    }
    
    // Отримуємо результат
    const result = await response.json();
    console.log('Розрахунок вартості успішно виконано:', JSON.stringify(result, null, 2));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Непередбачена помилка при розрахунку вартості:', error);
    return NextResponse.json(
      { message: 'Щось пішло не так при розрахунку вартості' },
      { status: 500 }
    );
  }
}
