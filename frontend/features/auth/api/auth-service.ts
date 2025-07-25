/**
 * @fileoverview Auth service для роботи з HttpOnly cookies
 * 
 * Особливості:
 * - Використовує orval згенеровані хуки
 * - Працює з HttpOnly cookies (токени не доступні в JS)
 * - Автоматичне оновлення через axios interceptors
 */

import { api } from '@/lib/axios';
import type { LoginRequest } from '@/shared/api/generated/auth';
import type { UserResponse } from '@/shared/api/generated/user';

interface AuthServiceResponse {
  success: boolean;
  message?: string;
  user?: UserResponse;
}

class AuthService {
  /**
   * Логін користувача
   * Токени зберігаються в HttpOnly cookies
   */
  async login(credentials: LoginRequest): Promise<AuthServiceResponse> {
    try {
      // Backend встановить HttpOnly cookies автоматично
      await api.post('/auth/login', credentials);
      
      // Спробуємо отримати користувача, але не блокуємо успішний логін
      let user = undefined;
      try {
        user = await this.getCurrentUser();
      } catch (getUserError) {
        // Ігноруємо помилку отримання користувача - логін все одно успішний
        console.log('Could not get user data after login, but login was successful');
      }
      
      return {
        success: true,
        user: user || undefined,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Невірний логін або пароль',
      };
    }
  }

  /**
   * Вихід з системи
   * Очищає HttpOnly cookies на backend
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Навіть якщо помилка - очищаємо локальний стан
    }
  }

  /**
   * Отримати поточного користувача
   */
  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      console.log('🔍 Getting current user from /users/me');
      const response = await api.get<UserResponse>('/users/me');
      console.log('✅ User data received:', response);
      return response;
    } catch (error: any) {
      console.log('❌ Get current user error:', error?.response?.status || error.message);
      
      // Якщо помилка 401 або 500 (що теж може означати не авторизований) - це нормально
      if (error?.response?.status === 401 || error?.response?.status === 500) {
        console.log('📌 User not authenticated, returning null');
        return null;
      }
      
      // Для інших помилок також повертаємо null, але логуємо
      console.error('Unexpected error getting user:', error);
      return null;
    }
  }

  /**
   * Перевірити чи користувач авторизований
   * Робить запит до API для перевірки cookies
   */
  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }

  /**
   * Оновити токен
   * Відбувається автоматично через axios interceptors
   */
  async refreshToken(): Promise<boolean> {
    try {
      await api.post('/auth/refresh-token');
      return true;
    } catch {
      return false;
    }
  }
}

// Експортуємо singleton instance
export const authService = new AuthService();