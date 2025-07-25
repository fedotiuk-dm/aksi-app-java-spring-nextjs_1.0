/**
 * @fileoverview Auth store з використанням Zustand для HttpOnly cookies
 * 
 * Особливості:
 * - Токени зберігаються в HttpOnly cookies (не в localStorage)
 * - Store зберігає тільки інформацію про користувача
 * - Автоматична синхронізація з API
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UserResponse } from '@/shared/api/generated/user';

interface AuthState {
  // User data
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: UserResponse | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
            state.error = null;
          }),

        setLoading: (isLoading) =>
          set((state) => {
            state.isLoading = isLoading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
            state.isLoading = false;
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
          }),

        reset: () => set(() => initialState),
      })),
      {
        name: 'auth-store',
        // Зберігаємо тільки базову інформацію (не токени!)
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
);

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;

// Role-based selectors (UserResponseRole має тільки ADMIN та OPERATOR)
export const selectIsAdmin = (state: AuthState) => state.user?.role === 'ADMIN';
export const selectIsOperator = (state: AuthState) => state.user?.role === 'OPERATOR';

// Permission selectors
export const selectCanManageUsers = (state: AuthState) => 
  state.user?.role === 'ADMIN';

export const selectCanTakeOrders = (state: AuthState) =>
  state.user?.role === 'ADMIN' || state.user?.role === 'OPERATOR';