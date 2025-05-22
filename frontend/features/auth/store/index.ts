import { create } from 'zustand';
import { AuthUser, UserRole, AuthError } from '../model/types';

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
        isLoggedIn: true,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user.id,
        position: user.position || null,
        error: null,
      });
    } else {
      // Якщо user = null, виконуємо logout
      get().logout();
    }
  },

  /**
   * Встановлює стан помилки
   */
  setError: (error: AuthError | null) => set({ error }),

  /**
   * Очищає помилку
   */
  clearError: () => set({ error: null }),

  /**
   * Встановлює стан завантаження
   */
  setLoading: (loading: boolean) => set({ loading }),

  /**
   * Виконує вихід користувача - очищає всі дані сесії
   */
  logout: () =>
    set({
      isLoggedIn: false,
      username: null,
      name: null,
      email: null,
      role: null,
      userId: null,
      position: null,
      error: null,
    }),

  /**
   * Перевіряє, чи користувач має певну роль
   */
  hasRole: (role: UserRole) => {
    const { isLoggedIn, role: userRole } = get();
    return isLoggedIn && userRole === role;
  },

  /**
   * Перевіряє, чи користувач залогінений
   */
  checkIsLoggedIn: () => get().isLoggedIn,
}));
