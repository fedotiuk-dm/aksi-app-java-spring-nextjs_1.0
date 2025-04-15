'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authApi from '../api/authApi';
import { AuthState, LoginRequest, RegisterRequest, User } from '../types';

interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}

/**
 * Початковий стан авторизації
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Сховище для управління станом автентифікації
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        /**
         * Функція входу користувача
         */
        login: async (credentials: LoginRequest) => {
          set({ isLoading: true, error: null });

          try {
            const authResponse = await authApi.login(credentials);
            const { accessToken, refreshToken, ...userData } = authResponse;

            // Зберігаємо токени і дані користувача
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('user', JSON.stringify(userData));
            }

            set({
              user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: unknown) {
            console.error('Login error:', error);
            const err = error as { response?: { data?: { message?: string } } };
            set({
              isLoading: false,
              error:
                err?.response?.data?.message ||
                'Помилка входу. Спробуйте пізніше.',
            });
            throw error;
          }
        },

        /**
         * Функція реєстрації нового користувача
         */
        register: async (registerData: RegisterRequest) => {
          set({ isLoading: true, error: null });

          try {
            const authResponse = await authApi.register(registerData);
            const { accessToken, refreshToken, ...userData } = authResponse;

            // Зберігаємо токени і дані користувача
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('user', JSON.stringify(userData));
            }

            set({
              user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: unknown) {
            console.error('Registration error:', error);
            const err = error as { response?: { data?: { message?: string } } };
            set({
              isLoading: false,
              error:
                err?.response?.data?.message ||
                'Помилка реєстрації. Спробуйте пізніше.',
            });
            throw error;
          }
        },

        /**
         * Функція виходу користувача
         */
        logout: () => {
          authApi.logout();
          set(initialState);
        },

        /**
         * Ініціалізація автентифікації
         */
        initAuth: () => {
          if (typeof window === 'undefined') return;

          try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
              const user: User = JSON.parse(userStr);
              set({
                user,
                isAuthenticated: true,
              });
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            set(initialState);
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
