import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '../types/authTypes';
import { useAuthStore } from '../store/authStore';
import { CLIENT_API_URL, AUTH_ENDPOINTS } from '@/constants/urls';

/**
 * Хук для входу користувача у систему
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setStoreError = useAuthStore((state) => state.setError);
  const setStoreLoading = useAuthStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);

  /**
   * Функція для входу користувача
   * @param credentials - дані для входу
   * @param redirectTo - шлях, на який перенаправити після успішного входу
   */
  const login = async (
    credentials: LoginRequest,
    redirectTo: string = '/dashboard'
  ) => {
    try {
      setIsLoading(true);
      setStoreLoading(true);
      setError(null);
      setStoreError(null);

      const apiUrl = `${CLIENT_API_URL}${AUTH_ENDPOINTS.LOGIN}`;
      console.log('Спроба виконати запит на логін до:', apiUrl);
      console.log('Дані для входу:', {
        username: credentials.username,
        password: '***',
      });

      // Викликаємо API роут для авторизації
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        cache: 'no-store', // Вимикаємо кешування запитів авторизації
      });

      console.log('Отримано відповідь:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Невідома помилка' }));
        const errorMessage =
          errorData.message || `Помилка авторизації (${response.status})`;

        console.error('Помилка авторизації:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
        });

        setError(errorMessage);
        setStoreError({
          status: response.status,
          message: errorMessage,
        });
        return;
      }

      const userData = await response.json();

      console.log('Успішна авторизація, отримано дані користувача', {
        id: userData.id,
        username: userData.username,
        role: userData.role,
      });

      // Встановлюємо дані користувача в store
      setUser(userData);

      // Перенаправляємо на цільову сторінку
      router.push(redirectTo);
    } catch (error) {
      console.error(
        'Необроблена помилка при спробі виконати запит на логін:',
        error
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Помилка авторизації';
      setError(errorMessage);
      setStoreError({
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    clearError: () => {
      setError(null);
      setStoreError(null);
    },
  };
};
