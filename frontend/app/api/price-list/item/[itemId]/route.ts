import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи з конкретним елементом прайс-листа
 * Шлях: /api/price-list/item/[itemId]
 * Методи:
 * - PUT - оновлення елемента прайс-листа
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка PUT запитів для оновлення елемента прайс-листа
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const itemId = params.itemId;
    
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
    const itemData = await request.json();
    console.log(`Оновлення елемента з ID: ${itemId}, Назва: ${itemData.name}`);
    
    // Детальне логування даних, які відправляються на бекенд
    console.log('PUT Request Data:', JSON.stringify(itemData, null, 2));
    
    // Перевірка наявності поля active та його значення
    if ('active' in itemData) {
      console.log(`Поле active є в даних, значення: ${itemData.active}`);
    } else if ('isActive' in itemData) {
      console.log(`Поле isActive є в даних, значення: ${itemData.isActive}`);
      // Якщо є тільки isActive, але нема active, додаємо поле active
      itemData.active = itemData.isActive;
    }
    
    // Перевірка полів з цінами
    ['basePrice', 'priceBlack', 'priceColor'].forEach(field => {
      if (field in itemData) {
        console.log(`Поле ${field} є в даних, значення: ${itemData[field]}, тип: ${typeof itemData[field]}`);
      }
    });
    
    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/price-list/item/${itemId}`;
    
    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на оновлення елемента до ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(itemData)
    });
    
    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(`Помилка від бекенду при оновленні елемента: ${response.status}`);
      
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
    const updatedItem = await response.json();
    console.log(`Оновлено елемент з ID: ${updatedItem.id}`);
    
    // Детальне логування відповіді від бекенду
    console.log('Updated item from backend:', JSON.stringify(updatedItem, null, 2));
    
    // Перевіряємо поле active у відповіді
    if ('active' in updatedItem) {
      console.log(`Поле active у відповіді: ${updatedItem.active}`);
    }
    
    // Повертаємо успішну відповідь
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Помилка при оновленні елемента прайс-листа:', error);
    return NextResponse.json(
      { message: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
