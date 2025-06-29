/**
 * @fileoverview Серверні функції для автентифікації з Orval клієнтами
 *
 * Використовує:
 * - Orval згенеровані auth функції
 * - Next.js cookies для зберігання токенів
 * - Оновлені адаптери для конвертації типів
 */

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

// Прямі Orval функції для серверного використання
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from '@/shared/api/generated/auth';
import type {
  LoginRequest,
  AuthResponse,
  UserResponse,
  RefreshTokenRequest,
} from '@/shared/api/generated/auth';

import {
  AuthUser,
  JwtPayload,
  UserRole,
  convertUserResponseToAuthUser,
  convertApiRoleToUserRole,
} from '../model/types';

// Назви cookies
const TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

// Серверні функції для роботи з автентифікацією
export const serverAuth = {
  /**
   * Логін користувача на сервері
   * @param credentials - логін та пароль
   * @returns об'єкт з інформацією про користувача
   */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      console.log('🔐 Виконуємо серверний логін через Orval');

      // Використовуємо прямий Orval виклик (не хук)
      const authResponse: AuthResponse = await loginUser(credentials);

      console.log('✅ Отримано відповідь від API:', authResponse);

      // Зберігаємо токени в cookies
      const cookieStore = await cookies();

      if (authResponse.accessToken) {
        cookieStore.set(TOKEN_COOKIE, authResponse.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60, // 1 година
          path: '/',
        });
      }

      if (authResponse.refreshToken) {
        cookieStore.set(REFRESH_TOKEN_COOKIE, authResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 днів
          path: '/',
        });
      }

      // Конвертуємо UserResponse до AuthUser
      const user = convertUserResponseToAuthUser(authResponse.user);

      console.log('✅ Успішний серверний логін:', user);
      return user;
    } catch (error) {
      console.error('❌ Помилка при серверному логіні:', error);
      throw error;
    }
  },

  /**
   * Оновлення токену на сервері
   * @returns об'єкт з інформацією про користувача або null
   */
  async refreshToken(): Promise<AuthUser | null> {
    try {
      console.log('🔄 Оновлюємо токен на сервері');
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

      if (!refreshToken) {
        console.warn('⚠️ Відсутній refresh token в cookies');
        return null;
      }

      // Використовуємо прямий Orval виклик
      const refreshRequest: RefreshTokenRequest = { refreshToken };
      const authResponse: AuthResponse = await refreshAccessToken(refreshRequest);

      // Оновлюємо accessToken в cookies
      if (authResponse.accessToken) {
        cookieStore.set(TOKEN_COOKIE, authResponse.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60, // 1 година
          path: '/',
        });
      }

      // Конвертуємо UserResponse до AuthUser
      const user = convertUserResponseToAuthUser(authResponse.user);

      console.log('✅ Токен оновлено на сервері:', user);
      return user;
    } catch (error) {
      console.error('❌ Помилка при оновленні токену на сервері:', error);
      return null;
    }
  },

  /**
   * Вихід користувача із системи
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 Виконуємо серверний logout');
      const cookieStore = await cookies();

      // Спробуємо викликати API logout
      try {
        await logoutUser();
        console.log('✅ API logout успішний');
      } catch (error) {
        console.warn('⚠️ Помилка API logout (продовжуємо очищення cookies):', error);
      }

      // Видаляємо cookies
      cookieStore.delete(TOKEN_COOKIE);
      cookieStore.delete(REFRESH_TOKEN_COOKIE);

      console.log('✅ Cookies очищені, серверний logout завершено');
    } catch (error) {
      console.error('❌ Помилка при серверному logout:', error);
      throw error;
    }
  },

  /**
   * Отримання інформації про поточного користувача через API
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = await this.getToken();

      if (!token) {
        console.log('⚠️ Токен відсутній для getCurrentUser');
        return null;
      }

      // Спробуємо отримати користувача через API
      try {
        const userResponse: UserResponse = await getCurrentUser();
        const user = convertUserResponseToAuthUser(userResponse);

        console.log('✅ Отримано користувача через API:', user);
        return user;
      } catch (error) {
        console.warn('⚠️ Помилка API getCurrentUser, спробуємо декодувати JWT:', error);

        // Fallback: декодуємо JWT токен
        return this.getUserFromToken(token);
      }
    } catch (error) {
      console.error('❌ Помилка при отриманні поточного користувача:', error);
      return null;
    }
  },

  /**
   * Декодування інформації про користувача з JWT токену
   */
  async getUserFromToken(token: string): Promise<AuthUser | null> {
    try {
      // Декодуємо JWT токен
      const decoded = jwtDecode<JwtPayload>(token);

      // Перевіряємо, чи токен не прострочений
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.warn('⚠️ JWT токен прострочений');
        return null;
      }

      // Конвертуємо роль з JWT
      const userRole = convertApiRoleToUserRole(decoded.role);

      // Повертаємо інформацію про користувача з токену
      return {
        id: decoded.sub,
        username: decoded.sub,
        name: decoded.name || '',
        email: decoded.email || '',
        role: userRole,
        position: undefined,
      };
    } catch (error) {
      console.error('❌ Помилка при декодуванні JWT токену:', error);
      return null;
    }
  },

  /**
   * Перевіряє, чи користувач має певну роль
   */
  async hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === requiredRole || false;
  },

  /**
   * Отримання токену з cookies
   */
  async getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_COOKIE)?.value || null;
  },

  /**
   * Отримання refresh токену з cookies
   */
  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null;
  },

  /**
   * Перевіряє чи користувач авторизований
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return Boolean(user);
  },
};
