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
import type { LoginResponse, SessionInfo } from '@/shared/api/generated/auth';
import { ROLES, type UserRole } from '@/features/auth';

interface AuthState {
  // User data
  user: LoginResponse | null;
  session: SessionInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: LoginResponse | null) => void;
  setSession: (session: SessionInfo | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  session: null,
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

        setSession: (session) =>
          set((state) => {
            state.session = session;
            state.isAuthenticated = !!session;
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
            state.session = null;
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
          session: state.session,
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
export const selectSession = (state: AuthState) => state.session;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;

// Role-based selectors
export const selectUserRoles = (state: AuthState) => state.user?.roles || [];
export const selectHasRole = (state: AuthState, role: UserRole) =>
  state.user?.roles?.includes(role) || false;

export const selectIsAdmin = (state: AuthState) =>
  state.user?.roles?.includes(ROLES.ADMIN) || false;
export const selectIsManager = (state: AuthState) =>
  state.user?.roles?.includes(ROLES.MANAGER) || false;
export const selectIsOperator = (state: AuthState) =>
  state.user?.roles?.includes(ROLES.OPERATOR) || false;
export const selectIsCleaner = (state: AuthState) =>
  state.user?.roles?.includes(ROLES.CLEANER) || false;
export const selectIsDriver = (state: AuthState) =>
  state.user?.roles?.includes(ROLES.DRIVER) || false;

// Permission selectors
export const selectPermissions = (state: AuthState) => state.user?.permissions || [];
export const selectHasPermission = (state: AuthState, permission: string) =>
  state.user?.permissions?.includes(permission) || false;

// Branch selectors
export const selectCurrentBranchId = (state: AuthState) => state.user?.branchId;
export const selectCurrentBranchName = (state: AuthState) => state.user?.branchName;
export const selectRequiresBranchSelection = (state: AuthState) =>
  state.user?.requiresBranchSelection || false;
