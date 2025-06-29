/**
 * @fileoverview Auth Feature Module з Orval API
 *
 * 🎯 Архітектура: "DDD inside, FSD outside" з Orval First підходом
 *
 * ✅ Структура:
 * - components/ - AuthGuard для захисту маршрутів
 * - ui/ - LoginForm, LogoutButton
 * - hooks/ - useAuth, useLogin, useLogout
 * - api/ - Orval API хуки
 * - server/ - Серверні функції для Next.js API роутів
 * - store/ - Zustand стор
 * - model/ - TypeScript типи та адаптери
 */

// 🔐 Auth Components
export { AuthGuard } from './components/AuthGuard';

// 🎨 Auth UI Components
export { LoginForm, LogoutButton } from './ui';

// 🎯 Auth Hooks
export { useAuth, useLogin, useLogout } from './hooks';

// 🌐 Auth API (Orval хуки)
export {
  useLogin as useApiLogin,
  useLogout as useApiLogout,
  useRefreshToken,
  useCurrentUser,
} from './api';

// 🏪 Auth Store
export { useAuthStore } from './store';

// 🖥️ Server Auth (для Next.js API роутів)
export { serverAuth } from './server/serverAuth';

// 📝 Auth Types
export type { AuthUser, UserRole, AuthError } from './model/types';
