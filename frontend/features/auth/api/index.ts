import { AuthenticationService } from '@/lib/api';
import { useApiMutation } from '@/lib/api/hooks';
import type { AuthResponse } from '@/lib/api/generated/models/AuthResponse';
import type { LoginRequest } from '@/lib/api/generated/models/LoginRequest';

/**
 * Хук для авторизації користувача
 */
export const useLogin = () => {
  return useApiMutation<AuthResponse, LoginRequest>(
    (loginData) => AuthenticationService.login({ 
      requestBody: loginData
    })
  );
};

/**
 * Хук для виходу з системи
 */
export const useLogout = () => {
  return useApiMutation<void, void>(
    () => fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => void 0)
  );
};

/**
 * Хук для оновлення JWT токена
 */
export const useRefreshToken = () => {
  return useApiMutation<AuthResponse, void>(
    () => fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (!res.ok) {
        throw new Error('Не вдалося оновити токен');
      }
      return res.json();
    })
  );
};
