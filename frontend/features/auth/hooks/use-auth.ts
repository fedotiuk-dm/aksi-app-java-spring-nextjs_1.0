/**
 * @fileoverview Основний auth хук для HttpOnly cookies
 */

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';
import { authService } from '../api/auth-service';

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    logout: logoutStore,
  } = useAuthStore();

  const checkAuth = async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ username, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        router.push('/dashboard');
        return { success: true };
      } else {
        setError(response.message || 'Помилка авторизації');
        return { success: false, error: response.message };
      }
    } catch {
      const message = 'Помилка з\'єднання з сервером';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      logoutStore();
      router.push('/login');
      setLoading(false);
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    checkAuth,
    
    // Role checks
    isAdmin: user?.role === 'ADMIN',
    isOperator: user?.role === 'OPERATOR',
    canManageUsers: user?.role === 'ADMIN',
  };
};