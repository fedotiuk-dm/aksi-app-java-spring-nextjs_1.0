import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { UUID } from 'crypto';
import { authApi } from '../api/authApi';
import {
  LoginRequest,
  JwtPayload,
  AuthUser,
  UserRole,
  AuthResponse,
  RegisterRequest,
} from '../types/authTypes';

// Назви cookies
const TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Опції для cookie
interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  expires?: Date;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  domain?: string;
  maxAge?: number;
}

// Визначаємо тип для cookieStore, щоб обійти проблеми з типізацією
type CookieStore = {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  delete: (name: string) => void;
};

/**
 * Конвертує AuthResponse від API в AuthUser для внутрішнього використання
 */
const convertToAuthUser = (response: AuthResponse): AuthUser => {
  return {
    id: response.id,
    username: response.username,
    name: response.name,
    email: response.email,
    role: response.role,
    position: response.position,
    isAuthenticated: true,
  };
};

// Серверні функції для роботи з автентифікацією
export const serverAuth = {
  /**
   * Логін користувача на сервері
   * @param credentials - логін та пароль
   * @returns об'єкт з інформацією про користувача
   */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      console.log('Серверний логін: спроба виконати запит до API');
      // Викликаємо API для логіну
      console.log('Викликаємо authApi.login з параметрами:', {
        username: credentials.username,
      });
      const response = await authApi.login(credentials);
      console.log('Отримано відповідь від API:', {
        id: response.id,
        username: response.username,
        role: response.role,
        tokenReceived: !!response.accessToken,
      });

      if (!response.accessToken) {
        console.error('Відсутній accessToken у відповіді API');
        throw new Error('Не вдалося отримати токен доступу');
      }

      // Зберігаємо токени у HttpOnly cookies
      console.log('Спроба зберегти токени в cookies');

      // Використовуємо правильний тип для cookieStore
      const cookieStore = cookies() as unknown as CookieStore;

      // Зберігаємо access token
      cookieStore.set(TOKEN_COOKIE, response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + response.expiresIn * 1000),
        path: '/',
        sameSite: 'strict',
      });
      console.log('ACCESS_TOKEN збережено в cookies');

      // Зберігаємо refresh token
      cookieStore.set(REFRESH_TOKEN_COOKIE, response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 днів
        path: '/',
        sameSite: 'strict',
      });
      console.log('REFRESH_TOKEN збережено в cookies');

      // Конвертуємо відповідь в AuthUser
      const authUser = convertToAuthUser(response);
      console.log('Конвертовано відповідь в AuthUser:', authUser);

      // Повертаємо інформацію про користувача
      return authUser;
    } catch (error) {
      console.error('Помилка авторизації:', error);
      console.error(
        'Деталі помилки:',
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : 'Unknown error'
      );

      // Передаємо більш детальну інформацію про помилку
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Невірний логін або пароль');
      }
    }
  },

  /**
   * Реєстрація нового користувача
   * @param registerData - дані для реєстрації
   * @returns об'єкт з інформацією про користувача
   */
  async register(registerData: RegisterRequest): Promise<AuthUser> {
    try {
      // Викликаємо API для реєстрації
      const response = await authApi.register(registerData);

      // Зберігаємо токени у HttpOnly cookies
      const cookieStore = cookies() as unknown as CookieStore;

      cookieStore.set(TOKEN_COOKIE, response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + response.expiresIn * 1000),
        path: '/',
        sameSite: 'strict',
      });

      cookieStore.set(REFRESH_TOKEN_COOKIE, response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 днів
        path: '/',
        sameSite: 'strict',
      });

      // Повертаємо інформацію про користувача
      return convertToAuthUser(response);
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      throw new Error('Не вдалося зареєструвати користувача');
    }
  },

  /**
   * Оновлення токену на сервері
   * @returns об'єкт з інформацією про користувача або null, якщо оновлення не вдалося
   */
  async refreshToken(): Promise<AuthUser | null> {
    const cookieStore = cookies() as unknown as CookieStore;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return null;
    }

    try {
      // Викликаємо API для оновлення токену
      const response = await authApi.refreshToken(refreshToken);

      // Оновлюємо токени у cookies
      cookieStore.set(TOKEN_COOKIE, response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + response.expiresIn * 1000),
        path: '/',
        sameSite: 'strict',
      });

      cookieStore.set(REFRESH_TOKEN_COOKIE, response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 днів
        path: '/',
        sameSite: 'strict',
      });

      // Повертаємо інформацію про користувача
      return convertToAuthUser(response);
    } catch (error) {
      console.error('Помилка оновлення токену:', error);
      // Видаляємо невалідні токени
      const cookieStore = cookies() as unknown as CookieStore;
      cookieStore.delete(TOKEN_COOKIE);
      cookieStore.delete(REFRESH_TOKEN_COOKIE);
      return null;
    }
  },

  /**
   * Вихід користувача із системи
   */
  async logout(): Promise<void> {
    // В бекенді немає ендпоінту для виходу, тому просто видаляємо cookies
    const cookieStore = cookies() as unknown as CookieStore;
    cookieStore.delete(TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
  },

  /**
   * Отримання інформації про поточного користувача
   * @returns об'єкт з інформацією про користувача або null, якщо не авторизований
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const cookieStore = cookies() as unknown as CookieStore;
    const token = cookieStore.get(TOKEN_COOKIE)?.value;

    if (!token) {
      return null;
    }

    try {
      // Розшифровуємо JWT токен для отримання інформації
      const payload = jwtDecode<JwtPayload>(token);

      // Перевіряємо, чи токен не прострочений
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return null;
      }

      return {
        id: (payload.userId || payload.sub) as UUID, // Використовуємо userId або sub в якості id
        username: payload.username || payload.sub, // Використовуємо username або sub
        name: payload.username || payload.sub, // Використовуємо username або sub
        email: payload.username || payload.sub, // Використовуємо username або sub
        role: payload.role || UserRole.USER, // За замовчуванням USER, якщо немає ролі
        isAuthenticated: true,
      };
    } catch (error) {
      console.error('Помилка отримання даних користувача:', error);
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
    return user?.role === requiredRole || false;
  },

  /**
   * Отримання поточного JWT токену з cookies
   * @returns JWT токен або null
   */
  async getToken(): Promise<string | null> {
    const cookieStore = cookies() as unknown as CookieStore;
    return cookieStore.get(TOKEN_COOKIE)?.value || null;
  },
};
