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
      await api.post('/api/auth/login', credentials);
      
      // Отримуємо дані користувача після успішного логіну
      const user = await this.getCurrentUser();
      
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
      await api.post('/api/auth/logout');
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
      console.log('🔍 Getting current user from /api/users/me');
      return await api.get<UserResponse>('/api/users/me');
    } catch (error) {
      console.error('Get current user error:', error);
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
      await api.post('/api/auth/refresh-token');
      return true;
    } catch {
      return false;
    }
  }
}

// Експортуємо singleton instance
export const authService = new AuthService();