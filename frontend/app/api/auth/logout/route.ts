import { NextResponse } from 'next/server';
import { serverAuth } from '@/features/auth/server/serverAuth';

/**
 * API роут для виходу користувача із системи
 * Примітка: на бекенді немає ендпоінту для виходу, тому це чисто клієнтська операція
 */
export async function POST() {
  try {
    // Просто видаляємо токени із cookies
    await serverAuth.logout();
    
    // Повертаємо успішний результат
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Помилка видалення токенів:', error);
    
    // Навіть якщо виникла помилка, все одно повідомляємо про успіх, щоб клієнт вийшов
    return NextResponse.json(
      { 
        success: true, 
        message: 'Сесія завершена' 
      }, 
      { status: 200 }
    );
  }
}
