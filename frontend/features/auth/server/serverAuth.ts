import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { AuthenticationService, OpenAPI } from '@/lib/api';
import { AuthUser, JwtPayload, UserRole, convertToAuthUser } from '../model/types';
import type { LoginRequest } from '@/lib/api/generated/models/LoginRequest';
import type { RegisterRequest } from '@/lib/api/generated/models/RegisterRequest';
import { SERVER_API_URL } from '@/constants/urls';

// Налаштовуємо базовий URL для серверних запитів
OpenAPI.BASE = `${SERVER_API_URL}/api`;

// Назви cookies
const TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Використовуємо стандартні опції для cookies з Next.js

// Серверні функції для роботи з автентифікацією
export const serverAuth = {
  /**
   * Логін користувача на сервері
   * @param credentials - логін та пароль
   * @returns об'єкт з інформацією про користувача
   */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      console.log('Виконуємо запит до бекенду для логіну');
      
      // Отримуємо JWT токен від бекенду
      const authResponse = await AuthenticationService.login({
        requestBody: credentials
      });
      
      if (!authResponse.accessToken || !authResponse.refreshToken) {
        throw new Error('Не отримано токени автентифікації');
      }
      
      // Зберігаємо токени в cookies
      const cookieStore = await cookies();
      
      // Зберігаємо access token
      cookieStore.set(TOKEN_COOKIE, authResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        // Якщо є expiresIn, встановлюємо maxAge
        maxAge: authResponse.expiresIn ? authResponse.expiresIn : 3600 // за замовчуванням 1 година
      });
      
      // Зберігаємо refresh token
      cookieStore.set(REFRESH_TOKEN_COOKIE, authResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 днів
      });
      
      // Конвертуємо відповідь в AuthUser
      return convertToAuthUser(authResponse);
    } catch (error) {
      console.error('Помилка при логіні:', error);
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
      console.log('Виконуємо запит для реєстрації');
      
      // Отримуємо JWT токен від бекенду
      const authResponse = await AuthenticationService.register({
        requestBody: registerData
      });
      
      if (!authResponse.accessToken || !authResponse.refreshToken) {
        throw new Error('Не отримано токени автентифікації');
      }
      
      // Зберігаємо токени в cookies
      const cookieStore = await cookies();
      
      cookieStore.set(TOKEN_COOKIE, authResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: authResponse.expiresIn ? authResponse.expiresIn : 3600
      });
      
      cookieStore.set(REFRESH_TOKEN_COOKIE, authResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 днів
      });
      
      // Конвертуємо відповідь в AuthUser
      return convertToAuthUser(authResponse);
    } catch (error) {
      console.error('Помилка при реєстрації:', error);
      throw error;
    }
  },
  
  /**
   * Оновлення токену на сервері
   * @returns об'єкт з інформацією про користувача або null, якщо оновлення не вдалося
   */
  async refreshToken(): Promise<AuthUser | null> {
    try {
      console.log('Намагаємось оновити токен');
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
      
      if (!refreshToken) {
        console.warn('Відсутній refresh_token в cookies');
        return null;
      }
      
      // Викликаємо API для оновлення токену
      const authResponse = await AuthenticationService.refreshToken({
        requestBody: refreshToken
      });
      
      if (!authResponse.accessToken) {
        console.warn('Не отримано новий access token');
        return null;
      }
      
      // Оновлюємо access token in cookies
      cookieStore.set(TOKEN_COOKIE, authResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: authResponse.expiresIn ? authResponse.expiresIn : 3600
      });
      
      // Якщо отримали новий refresh token, оновлюємо його теж
      if (authResponse.refreshToken) {
        cookieStore.set(REFRESH_TOKEN_COOKIE, authResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 // 7 днів
        });
      }
      
      // Повертаємо оновлену інформацію про користувача
      return convertToAuthUser(authResponse);
    } catch (error) {
      console.error('Помилка при оновленні токену:', error);
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
  },
  
  /**
   * Отримання інформації про поточного користувача
   * @returns об'єкт з інформацією про користувача або null, якщо не авторизований
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        console.log('Токен відсутній');
        return null;
      }
      
      try {
        // Розшифровуємо JWT токен
        const payload = jwtDecode<JwtPayload>(token);
        
        // Перевіряємо термін дії токена
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp < currentTime) {
          console.log('Токен протермінований, намагаємось оновити');
          return await this.refreshToken();
        }
        
        // Повертаємо інформацію про користувача з JWT
        return {
          id: payload.sub,
          username: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        };
      } catch (error) {
        console.error('Помилка розшифрування JWT:', error);
        return null;
      }
    } catch (error) {
      console.error('Помилка отримання поточного користувача:', error);
      return null;
    }
  },
  
  /**
   * Перевірка, чи користувач має певну роль
   * @param requiredRole - роль для перевірки
   * @returns true, якщо користувач має цю роль, інакше false
   */
  async hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user && user.role === requiredRole;
  },
  
  /**
   * Отримання поточного JWT токену з cookies
   * @returns JWT токен або null
   */
  async getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_COOKIE)?.value || null;
  }
};
