import axios from 'axios';
import {
  LoginRequest,
  AuthResponse,
  RegisterRequest,
} from '../types/authTypes';
import { SERVER_API_URL } from '@/constants/urls';

// API методи для роботи з бекендом, які будуть викликатися тільки з серверних функцій
export const authApi = {
  /**
   * Реєстрація нового користувача
   * @param registerData - дані для реєстрації
   * @returns об'єкт відповіді з токенами та інформацією про користувача
   */
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const apiUrl = `${SERVER_API_URL}/api/auth/register`;
      console.log(`Виконуємо запит до ${apiUrl}`);
      const response = await axios.post<AuthResponse>(apiUrl, registerData);
      console.log('Успішна відповідь від API:', { status: response.status });
      return response.data;
    } catch (error) {
      console.error('Помилка при виконанні register API запиту:', error);
      if (axios.isAxiosError(error)) {
        console.error('Деталі Axios помилки:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
      }
      throw error;
    }
  },

  /**
   * Логін користувача
   * @param credentials - облікові дані користувача (username і password)
   * @returns об'єкт відповіді з токенами та інформацією про користувача
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const apiUrl = `${SERVER_API_URL}/api/auth/login`;
      console.log(`Виконуємо запит до ${apiUrl}`);
      const response = await axios.post<AuthResponse>(apiUrl, credentials);
      console.log('Успішна відповідь від API:', { status: response.status });
      return response.data;
    } catch (error) {
      console.error('Помилка при виконанні login API запиту:', error);
      if (axios.isAxiosError(error)) {
        console.error('Деталі Axios помилки:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
      }
      throw error;
    }
  },

  /**
   * Оновлення JWT токену
   * @param refreshToken - поточний refresh токен
   * @returns об'єкт з новими токенами та інформацією про користувача
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const apiUrl = `${SERVER_API_URL}/api/auth/refresh-token`;
      console.log(`Виконуємо запит до ${apiUrl}`);
      const response = await axios.post<AuthResponse>(apiUrl, refreshToken, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      console.log('Успішна відповідь від API:', { status: response.status });
      return response.data;
    } catch (error) {
      console.error('Помилка при виконанні refreshToken API запиту:', error);
      if (axios.isAxiosError(error)) {
        console.error('Деталі Axios помилки:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
      }
      throw error;
    }
  },

  /**
   * Перевірка доступності API авторизації
   * @returns текстове повідомлення про статус
   */
  async testAuth(): Promise<string> {
    try {
      const apiUrl = `${SERVER_API_URL}/api/auth/test`;
      console.log(`Виконуємо запит до ${apiUrl}`);
      const response = await axios.get(apiUrl);
      console.log('Успішна відповідь від API:', { status: response.status });
      return response.data;
    } catch (error) {
      console.error('Помилка при виконанні testAuth API запиту:', error);
      if (axios.isAxiosError(error)) {
        console.error('Деталі Axios помилки:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
      }
      throw error;
    }
  },
};
