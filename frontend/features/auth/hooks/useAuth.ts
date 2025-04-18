import { useAuthStore } from '../store/authStore';

/**
 * Хук для отримання інформації про поточну авторизацію
 */
export const useAuth = () => {
  const { 
    isLoggedIn, 
    username, 
    name,
    email,
    role,
    userId,
    position,
    error, 
    loading, 
    hasRole, 
    logout 
  } = useAuthStore();
  
  return {
    isLoggedIn,
    username,
    name,
    email,
    role,
    userId,
    position,
    error,
    loading,
    hasRole,
    logout,
  };
};
