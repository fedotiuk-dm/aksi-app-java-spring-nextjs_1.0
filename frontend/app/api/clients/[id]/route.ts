import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи з окремим клієнтом за ID
 * Шлях: /api/clients/[id]
 * Методи:
 * - GET - отримання даних клієнта
 * - PUT - оновлення даних клієнта
 * - DELETE - видалення клієнта
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Отримання даних клієнта за ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('Відсутній токен автентифікації');
      return NextResponse.json(
        { message: 'Необхідно авторизуватися' },
        { status: 401 }
      );
    }
    
    const clientId = params.id;
    console.log(`Отримання даних клієнта з ID: ${clientId}`);
    
    const response = await fetch(`${SERVER_API_URL}/clients/${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      console.error(`Помилка від бекенду при отриманні клієнта: ${response.status}`);
      
      let errorData;
      try {
        errorData = await response.json();
        console.error('Деталі помилки від бекенду:', errorData);
      } catch (error) {
        errorData = { message: 'Не вдалося отримати деталі помилки' };
        console.error('Не вдалося отримати деталі помилки:', error);
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { message: 'Клієнта не знайдено' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        errorData || { message: 'Помилка при обробці запиту на сервері' },
        { status: response.status }
      );
    }
    
    const clientData = await response.json();
    console.log(`Успішно отримано дані клієнта: ${clientId}`);
    
    return NextResponse.json(clientData);
  } catch (error) {
    console.error('Помилка при отриманні даних клієнта:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

/**
 * Оновлення даних клієнта за ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('Відсутній токен автентифікації');
      return NextResponse.json(
        { message: 'Необхідно авторизуватися' },
        { status: 401 }
      );
    }
    
    const clientId = params.id;
    console.log(`Оновлення даних клієнта з ID: ${clientId}`);
    
    // Отримуємо дані для оновлення з тіла запиту
    const updateData = await request.json();
    console.log('Дані для оновлення клієнта:', updateData);
    
    const response = await fetch(`${SERVER_API_URL}/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      console.error(`Помилка від бекенду при оновленні клієнта: ${response.status}`);
      
      let errorData;
      try {
        errorData = await response.json();
        console.error('Деталі помилки від бекенду:', errorData);
      } catch (error) {
        errorData = { message: 'Не вдалося отримати деталі помилки' };
        console.error('Не вдалося отримати деталі помилки:', error);
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { message: 'Клієнта не знайдено' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        errorData || { message: 'Помилка при обробці запиту на сервері' },
        { status: response.status }
      );
    }
    
    const updatedClient = await response.json();
    console.log(`Успішно оновлено дані клієнта: ${clientId}`);
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Помилка при оновленні даних клієнта:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

/**
 * Видалення клієнта за ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('Відсутній токен автентифікації');
      return NextResponse.json(
        { message: 'Необхідно авторизуватися' },
        { status: 401 }
      );
    }
    
    const clientId = params.id;
    console.log(`Видалення клієнта з ID: ${clientId}`);
    
    const response = await fetch(`${SERVER_API_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      console.error(`Помилка від бекенду при видаленні клієнта: ${response.status}`);
      
      let errorData;
      try {
        errorData = await response.json();
        console.error('Деталі помилки від бекенду:', errorData);
      } catch (error) {
        errorData = { message: 'Не вдалося отримати деталі помилки' };
        console.error('Не вдалося отримати деталі помилки:', error);
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { message: 'Клієнта не знайдено' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        errorData || { message: 'Помилка при обробці запиту на сервері' },
        { status: response.status }
      );
    }
    
    // Перевіряємо, чи є відповідь порожньою або у форматі JSON
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = { success: true, message: 'Клієнта успішно видалено' };
    }
    
    console.log(`Успішно видалено клієнта: ${clientId}`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Помилка при видаленні клієнта:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
