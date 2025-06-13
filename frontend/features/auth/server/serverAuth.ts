/**
 * @fileoverview Серверні функції для автентифікації з Orval клієнтами
 *
 * Використовує:
 * - Orval згенеровані auth функції
 * - Next.js cookies для зберігання токенів
 * - Адаптери для конвертації типів
 */

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

import {
  authLogin,
  authRegister,
  authRefreshToken,
  authTestEndpoint,
} from '@/shared/api/generated/auth';

import {
  AuthUser,
  JwtPayload,
  UserRole,
  adaptOrvalLoginResponse,
  adaptOrvalRegisterResponse,
} from '../model/types';

import type { LoginRequest, RegisterRequest } from '@/shared/api/generated/auth';

// Назви cookies
const TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Серверні функції для роботи з автентифікацією
export const serverAuth = {
  /**
   * Логін користувача на сервері
   * @param credentials - логін та пароль
   * @returns об'єкт з інформацією про користувача
   */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      console.log('🔐 Виконуємо запит до бекенду для логіну через Orval');

      // Використовуємо Orval згенерований клієнт
      const orvalResponse = await authLogin(credentials);

      // Адаптуємо Orval відповідь до AuthUser
      const user = adaptOrvalLoginResponse(orvalResponse);

      // TODO: Зберігання токенів в cookies (коли бекенд поверне токени)
      // Поки що працюємо без токенів
      console.log('✅ Успішний логін через Orval:', user);

      return user;
    } catch (error) {
      console.error('❌ Помилка при логіні через Orval:', error);
      throw error;
    }
  },

  /**
   * Реєстрація нового користувача
   * @param registerData - дані для реєстрації
   * @returns об'єкт з інформацією про користувача
   */
  async register(registerData: RegisterRequest): Promise<AuthUser> {
    try {
      console.log('🔐 Виконуємо запит для реєстрації через Orval');

      // Використовуємо Orval згенерований клієнт
      const orvalResponse = await authRegister(registerData);

      // Адаптуємо Orval відповідь до AuthUser
      const user = adaptOrvalRegisterResponse(orvalResponse);

      // TODO: Зберігання токенів в cookies (коли бекенд поверне токени)
      console.log('✅ Успішна реєстрація через Orval:', user);

      return user;
    } catch (error) {
      console.error('❌ Помилка при реєстрації через Orval:', error);
      throw error;
    }
  },

  /**
   * Оновлення токену на сервері
   * @returns об'єкт з інформацією про користувача або null, якщо оновлення не вдалося
   */
  async refreshToken(): Promise<AuthUser | null> {
    try {
      console.log('🔄 Намагаємось оновити токен через Orval');
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

      if (!refreshToken) {
        console.warn('⚠️ Відсутній refresh_token в cookies');
        return null;
      }

      // Використовуємо Orval згенерований клієнт
      const orvalResponse = await authRefreshToken(refreshToken);

      // TODO: Адаптувати refresh token response
      // Поки що повертаємо null
      console.log('✅ Токен оновлено через Orval:', orvalResponse);

      return null; // TODO: Адаптувати коли бекенд поверне правильну структуру
    } catch (error) {
      console.error('❌ Помилка при оновленні токену через Orval:', error);
      return null;
    }
  },

  /**
   * Тестування auth API
   * @returns результат тесту або null при помилці
   */
  async testAuthApi(): Promise<string | null> {
    try {
      console.log('🧪 Тестуємо auth API через Orval');

      const testResult = await authTestEndpoint();

      console.log('✅ Auth API тест пройшов успішно:', testResult);
      return testResult;
    } catch (error) {
      console.error('❌ Помилка при тестуванні auth API:', error);
      return null;
    }
  },

  /**
   * Вихід користувача із системи
   */
  async logout(): Promise<void> {
    const cookieStore = await cookies();

    // Видаляємо cookies
    cookieStore.delete(TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);

    console.log('🚪 Користувач вийшов з системи');
  },

  /**
   * Отримання інформації про поточного користувача
   * @returns об'єкт з інформацією про користувача або null, якщо не авторизований
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = await this.getToken();

      if (!token) {
        console.log('⚠️ Токен відсутній');
        return null;
      }

      // Декодуємо JWT токен для отримання інформації про користувача
      const decoded = jwtDecode<JwtPayload>(token);

      // Перевіряємо, чи токен не прострочений
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.warn('⚠️ Токен прострочений');
        return null;
      }

      // Повертаємо інформацію про користувача з токену
      return {
        id: decoded.sub,
        username: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      console.error('❌ Помилка при отриманні поточного користувача:', error);
      return null;
    }
  },

  /**
   * Перевіряє, чи користувач має певну роль
   * @param requiredRole - необхідна роль
   * @returns true, якщо користувач має роль
   */
  async hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === requiredRole || false;
  },

  /**
   * Отримання токену з cookies
   * @returns токен або null, якщо відсутній
   */
  async getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_COOKIE)?.value || null;
  },
};
