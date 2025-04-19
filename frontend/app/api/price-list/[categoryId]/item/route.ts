import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/constants/urls';

/**
 * API роут для роботи з елементами прайс-листа в категорії
 * Шлях: /api/price-list/[categoryId]/item
 * Методи:
 * - POST - створення нового елемента прайс-листа
 */

// Функція для отримання JWT токена з cookies
const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

/**
 * Обробка POST запитів для створення нового елемента прайс-листа
 */
export async function POST(
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
    const itemData = await request.json();

    // Детальне логування всіх даних
    console.log('===== ПОЧАТОК ДАНИХ ЗАПИТУ =====');
    console.log('categoryId з URL:', categoryId);
    console.log('itemData object:', JSON.stringify(itemData, null, 2));
    console.log('Required fields check:');
    console.log('- name:', itemData.name ? '⚠️ OK' : '❌ MISSING');
    console.log(
      '- catalogNumber:',
      itemData.catalogNumber ? '⚠️ OK' : '❌ MISSING'
    );
    console.log(
      '- unitOfMeasure:',
      itemData.unitOfMeasure ? '⚠️ OK' : '❌ MISSING'
    );
    console.log(
      '- basePrice:',
      itemData.basePrice !== undefined ? '⚠️ OK' : '❌ MISSING'
    );
    console.log(
      '- categoryId in data:',
      itemData.categoryId ? '⚠️ OK' : '❌ MISSING'
    );
    console.log('===== КІНЕЦЬ ДАНИХ ЗАПИТУ =====');

    console.log(
      `Створення нового елемента в категорії ${categoryId}: ${itemData.name}`
    );

    // Формуємо URL для запиту до бекенду
    const apiUrl = `${SERVER_API_URL}/api/price-list/${categoryId}/item`;

    // Виконуємо запит до бекенду
    console.log(`Надсилаємо запит на створення елемента до ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      // Переконатися, що categoryId передається коректно
      body: JSON.stringify({
        ...itemData,
        // Якщо categoryId відсутній в даних, використовуємо з URL
        categoryId: itemData.categoryId || categoryId,
      }),
    });

    // Перевіряємо відповідь
    if (!response.ok) {
      console.error(
        `Помилка від бекенду при створенні елемента: ${response.status}`
      );
      console.error(`URL, що використовувався: ${apiUrl}`);
      console.error(`Метод: POST`);

      // Спробуємо отримати текст відповіді
      const responseText = await response.text().catch(() => null);
      if (responseText) {
        console.error(`Текст відповіді:`, responseText);
      }

      // Спробуємо отримати деталі помилки
      let errorData;
      try {
        // Спробуємо парсити JSON лише якщо відповідь має відповідний заголовок
        if (response.headers.get('content-type')?.includes('application/json')) {
          errorData = JSON.parse(responseText || '{}');
          console.error('Деталі помилки від бекенду:', errorData);
        } else {
          // Якщо відповідь не JSON, створюємо своє повідомлення
          errorData = { 
            message: `Помилка при створенні позиції прайс-листа (${response.status})`,
            serverErrorMessage: responseText ? `${responseText.substring(0, 100)}...` : 'Немає деталей'
          };
          console.error('Помилка сервера, не JSON:', errorData);
        }
      } catch (error) {
        errorData = { 
          message: 'Не вдалося створити позицію прайс-листа',
          serverErrorMessage: responseText ? `${responseText.substring(0, 100)}...` : 'Немає деталей'
        };
        console.error('Помилка парсингу відповіді:', error);
      }

      return NextResponse.json(
        errorData || { message: 'Помилка при обробці запиту на сервері' },
        { status: response.status }
      );
    }

    // Отримуємо дані відповіді
    const createdItem = await response.json();
    console.log(`Створено новий елемент з ID: ${createdItem.id}`);

    // Повертаємо успішну відповідь
    return NextResponse.json(createdItem, { status: 201 });
  } catch (error) {
    console.error('Помилка при створенні елемента прайс-листа:', error);
    
    // Детальніша інформація про помилку
    let errorMessage = 'Внутрішня помилка сервера';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else if (typeof error === 'string') {
      errorMessage += `: ${error}`;
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
