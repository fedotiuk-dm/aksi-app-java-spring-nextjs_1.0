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
  clearUser: () => void; // Додаємо alias для logout
  hasRole: (role: UserRole) => boolean;
  checkIsLoggedIn: () => boolean;
  clearError: () => void;

  // Додаткові методи для перевірки ролей
  isAdmin: () => boolean;
  isManagerOrAdmin: () => boolean;
  canHandleCash: () => boolean;
  canTakeOrders: () => boolean;
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
      console.log('🔐 Зберігаємо користувача в store:', user);
      set({
        isLoggedIn: true,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user.id,
        position: user.position || null,
        error: null,
        loading: false,
      });
      console.log('✅ Користувач збережений в store, роль:', user.role);
    } else {
      // Якщо user = null, виконуємо logout
      console.log('🚪 Очищуємо користувача з store');
      get().logout();
    }
  },

  /**
   * Встановлює стан помилки
   */
  setError: (error: AuthError | null) => {
    console.log('🚨 Встановлюємо помилку в store:', error);
    set({ error, loading: false });
  },

  /**
   * Очищає помилку
   */
  clearError: () => set({ error: null }),

  /**
   * Встановлює стан завантаження
   */
  setLoading: (loading: boolean) => {
    console.log('⏳ Встановлюємо стан завантаження:', loading);
    set({ loading });
  },

  /**
   * Виконує вихід користувача - очищає всі дані сесії
   */
  logout: () => {
    console.log('🚪 Виконуємо logout в store');

    // Очищуємо токени з localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('🗑️ Токени очищено з localStorage');
    }

    set({
      isLoggedIn: false,
      username: null,
      name: null,
      email: null,
      role: null,
      userId: null,
      position: null,
      error: null,
      loading: false,
    });
  },

  /**
   * Alias для logout
   */
  clearUser: () => get().logout(),

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

  /**
   * Перевіряє чи є користувач адміністратором
   */
  isAdmin: () => {
    const { isLoggedIn, role } = get();
    return isLoggedIn && role === UserRole.ADMIN;
  },

  /**
   * Перевіряє чи є користувач менеджером або адміністратором
   */
  isManagerOrAdmin: () => {
    const { isLoggedIn, role } = get();
    return isLoggedIn && (role === UserRole.MANAGER || role === UserRole.ADMIN);
  },

  /**
   * Перевіряє чи може користувач працювати з касою
   */
  canHandleCash: () => {
    const { isLoggedIn, role } = get();
    return (
      isLoggedIn &&
      (role === UserRole.CASHIER || role === UserRole.MANAGER || role === UserRole.ADMIN)
    );
  },

  /**
   * Перевіряє чи може користувач приймати замовлення
   */
  canTakeOrders: () => {
    const { isLoggedIn, role } = get();
    return isLoggedIn && role !== UserRole.CASHIER; // Всі крім касира
  },
}));
