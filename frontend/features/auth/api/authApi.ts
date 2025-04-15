'use client';

import { api } from '@/lib/axios';
import axios from '@/lib/axios';
import { API_ROUTES } from '@/constants';
import { removeClientToken, setClientToken } from '@/lib/auth';
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  LoginDto,
} from '../types';

// Тип для користувача
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Інтерфейс відповіді авторизації
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Інтерфейс для зміни паролю
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * API клієнт для автентифікації
 */
const authApi = {
  /**
   * Виконує вхід користувача - версія з API_ROUTES
   * @param credentials дані для входу
   * @returns відповідь з токеном та інформацією користувача
   */
  login: async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials as unknown as Record<string, unknown>
    );
    return response;
  },

  /**
   * Виконує вхід користувача - версія з прямим шляхом для зворотної сумісності
   * @param data дані для входу
   * @returns відповідь з токеном та інформацією користувача
   */
  loginWithPath: async (data: LoginDto): Promise<AuthResponse> => {
    console.log('Відправляємо запит на логін (authApi.ts):', data);

    try {
      // Спроба використати API роут NextJS
      const response = await axios.post<AuthResponse>('/api/auth/login', data);
      console.log(
        'Отримано відповідь від сервера (authApi.ts):',
        response.data
      );

      // Отримуємо токен з відповіді
      const token = response.data.accessToken || response.data.token;

      // Якщо токен отримано - зберігаємо його в cookie
      if (token) {
        console.log('Зберігаємо токен в cookie на клієнті');
        setClientToken(token);
      }

      return response.data;
    } catch (error) {
      console.error('Помилка при логіні через API роут:', error);

      // Спроба прямого запиту до бекенду як fallback
      console.log('Спроба прямого запиту до бекенду');
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      const directResponse = await axios.post<AuthResponse>(
        `${baseUrl}/auth/login`,
        data
      );
      console.log(
        'Отримано відповідь від прямого запиту:',
        directResponse.data
      );

      // Отримуємо токен з прямої відповіді
      const token =
        directResponse.data.accessToken || directResponse.data.token;

      // Якщо токен отримано - зберігаємо його в cookie
      if (token) {
        console.log('Зберігаємо токен в cookie на клієнті (прямий запит)');
        setClientToken(token);
      }

      return directResponse.data;
    }
  },

  /**
   * Реєструє нового користувача
   * @param userData дані для реєстрації
   * @returns відповідь з токеном та інформацією користувача
   */
  register: async (userData: RegisterRequest) => {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      userData as unknown as Record<string, unknown>
    );
    return response;
  },

  /**
   * Виконує вихід користувача (видаляє токени)
   */
  logout: async (): Promise<void> => {
    try {
      // Спроба викликати API для логаута
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Помилка при виході:', error);
    } finally {
      // Видаляємо токени з localStorage у будь-якому випадку
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Також видаляємо з cookies
        removeClientToken();
      }
    }
  },

  /**
   * Оновлює access token за допомогою refresh token
   * @param request запит з refresh token
   * @returns нова пара токенів
   */
  refreshToken: async (request: RefreshTokenRequest) => {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.REFRESH,
      request as unknown as Record<string, unknown>
    );
    return response;
  },
};

// Функції для роботи з токенами у localStorage
export const authTokens = {
  // Збереження токенів
  setTokens: (token: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      console.log('Зберігаємо токени в localStorage:', {
        tokenLength: token.length,
      });
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  // Отримання токена
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
  },

  // Отримання refresh токена
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },

  // Видалення токенів
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      console.log('Видаляємо токени з localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};

// Експортуємо функції окремо (для сумісності з попереднім кодом)
export const login = authApi.loginWithPath;
export const logout = authApi.logout;

export default authApi;
