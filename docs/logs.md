
Проблема з logout пов'язана з тим, що функція logout не визначена або неправильно імпортована у вашому компоненті Layout.

Помилка `Uncaught TypeError: v is not a function` свідчить про те, що код намагається викликати щось, що не є функцією. У вашому випадку, коли ви натискаєте на кнопку logout, код намагається викликати змінну "v", яка повинна бути функцією logout, але вона не є функцією.

Ось як виправити цю проблему:

1. **Виправлення функції logout в Layout:**

```tsx
// Файл: frontend/app/(app)/layout.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';
// або імпортуйте функцію logout з вашого API клієнта 
import { logout } from '@/features/auth/api/authApi';

export default function AppLayout({ children }) {
  const router = useRouter();
  
  // Правильний спосіб обробки logout
  const handleLogout = async () => {
    try {
      // Виклик API для logout
      await logout();
      
      // Перенаправлення на сторінку логіну
      router.push('/login');
    } catch (error) {
      console.error('Помилка при виході з системи:', error);
    }
  };
  
  return (
    <div>
      {/* Інші елементи layout */}
      <button onClick={handleLogout}>Вийти</button>
      {children}
    </div>
  );
}
```

2. **Переконайтеся, що у вас є реалізація API для logout**:

```tsx
// Файл: frontend/features/auth/api/authApi.ts

// Додайте або оновіть цю функцію
export const logout = async (): Promise<boolean> => {
  try {
    // Запит на бекенд, якщо потрібно
    // const response = await fetch('/api/auth/logout', { method: 'POST' });
    
    // Видалення даних авторизації на клієнті
    // Очищення локального стану, якщо використовуєте Zustand
    
    // Перенаправлення на API route для очищення cookies
    await fetch('/api/auth/logout', { method: 'POST' });
    
    return true;
  } catch (error) {
    console.error('Помилка під час виходу:', error);
    return false;
  }
};
```

3. **Створіть API route для logout, якщо його немає**:

```tsx
// Файл: frontend/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Очищаємо cookies
  const cookiesStore = cookies();
  cookiesStore.delete('auth_token');
  cookiesStore.delete('refresh_token');
  
  return NextResponse.json({ success: true });
}
```

Ці зміни повинні виправити проблему з функцією logout і запобігти помилці "v is not a function".

Щодо помилки 404 для `/settings?_rsc=sheco` - перевірте, що у вас правильно налаштований маршрут `/settings` у структурі App Router.
