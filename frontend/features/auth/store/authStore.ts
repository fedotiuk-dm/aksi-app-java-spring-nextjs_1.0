import { create } from 'zustand';
import { AuthUser, UserRole, AuthError } from '../types/authTypes';

interface AuthState {
  // Стан авторизації
  isLoggedIn: boolean;
  username: string | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  userId: string | null;
  position: string | null;
  loading: boolean;
  error: AuthError | null;
  
  // Методи для керування авторизацією на стороні клієнта
  setUser: (user: AuthUser | null) => void;
  setError: (error: AuthError | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  checkIsLoggedIn: () => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  username: null,
  name: null,
  email: null,
  role: null,
  userId: null,
  position: null,
  loading: false,
  error: null,
  
  /**
   * Встановлює інформацію про користувача
   */
  setUser: (user: AuthUser | null) => {
    if (user) {
      set({
        isLoggedIn: user.isAuthenticated,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user.id?.toString() || null,
        position: user.position || null,
        error: null,
      });
    } else {
      set({
        isLoggedIn: false,
        username: null,
        name: null,
        email: null,
        role: null,
        userId: null,
        position: null,
      });
    }
  },
  
  /**
   * Встановлює стан помилки
   */
  setError: (error: AuthError | null) => {
    set({ error });
  },
  
  /**
   * Очищує помилку
   */
  clearError: () => {
    set({ error: null });
  },
  
  /**
   * Встановлює стан завантаження
   */
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  
  /**
   * Очищує стан авторизації (локальний вихід)
   */
  logout: () => {
    set({
      isLoggedIn: false,
      username: null,
      name: null,
      email: null,
      role: null,
      userId: null,
      position: null,
      error: null,
    });
  },
  
  /**
   * Перевіряє, чи користувач має певну роль
   */
  hasRole: (role: UserRole) => {
    return get().role === role;
  },
  
  /**
   * Перевіряє, чи користувач авторизований
   */
  checkIsLoggedIn: () => {
    return get().isLoggedIn;
  },
}));
