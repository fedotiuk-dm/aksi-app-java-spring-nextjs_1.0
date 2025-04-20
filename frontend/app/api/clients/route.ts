import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи зі списком клієнтів
 * Шлях: /api/v1/clients
 * Методи:
 * - POST - створення нового клієнта
 * - GET - отримання списку клієнтів (потенційно з пагінацією)
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка POST запитів для створення нового клієнта
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
    console.log('Створення клієнта: отримано запит');

    // Отримуємо дані клієнта з тіла запиту
    const clientData = await request.json();
    console.log('Дані нового клієнта:', clientData);

    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на створення клієнта до ${SERVER_API_URL}/api/clients`);
    
    const response = await fetch(`${SERVER_API_URL}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(clientData)
    });
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при створенні клієнта: ${response.status}`);
      
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
    
    // Отримуємо дані відповіді (створений клієнт)
    const createdClient = await response.json();
    console.log('Клієнт успішно створений:', createdClient.id);
    
    // Повертаємо успішну відповідь
    return NextResponse.json(createdClient);
  } catch (error) {
    console.error('Помилка при створенні клієнта:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

/**
 * Обробка GET запитів для отримання списку клієнтів
 */
export async function GET(request: NextRequest) {
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
    
    // Отримуємо параметри запиту (пагінація, сортування)
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '0';
    const size = url.searchParams.get('size') || '10';
    const sortBy = url.searchParams.get('sortBy') || 'firstName';
    const sortDir = url.searchParams.get('sortDir') || 'asc';
    
    console.log(`Отримання списку клієнтів: page=${page}, size=${size}, sortBy=${sortBy}, sortDir=${sortDir}`);
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = new URL(`${SERVER_API_URL}/api/v1/clients`);
    apiUrl.searchParams.append('page', page);
    apiUrl.searchParams.append('size', size);
    apiUrl.searchParams.append('sortBy', sortBy);
    apiUrl.searchParams.append('sortDir', sortDir);
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на отримання списку клієнтів до ${apiUrl.toString()}`);
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при отриманні списку клієнтів: ${response.status}`);
      
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
    console.log(`Отримано ${clientsData.totalElements || 0} клієнтів`);
    
    // Повертаємо успішну відповідь
    return NextResponse.json(clientsData);
  } catch (error) {
    console.error('Помилка при отриманні списку клієнтів:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
