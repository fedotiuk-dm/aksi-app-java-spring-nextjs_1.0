import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи з конкретною категорією прайс-листа
 * Шлях: /api/price-list/category/[categoryId]
 * Методи:
 * - PUT - оновлення категорії послуг
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка PUT запитів для оновлення категорії послуг
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = params.categoryId;
    
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
    console.log(`Оновлення категорії з ID: ${categoryId}, Назва: ${categoryData.name}`);
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/price-list/category/${categoryId}`;
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на оновлення категорії до ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(categoryData)
    });
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при оновленні категорії: ${response.status}`);
      
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
    const updatedCategory = await response.json();
    console.log(`Оновлено категорію з ID: ${updatedCategory.id}`);
    
    // Повертаємо успішну відповідь
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Помилка при оновленні категорії:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
