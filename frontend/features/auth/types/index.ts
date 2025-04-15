import { z } from 'zod';

/**
 * Схема валідації для логіну
 */
export const loginSchema = z.object({
  username: z.string().min(1, "Логін обов'язковий"),
  password: z.string().min(6, 'Пароль повинен містити мінімум 6 символів'),
});

/**
 * Типи запитів для автентифікації
 */
export type LoginRequest = z.infer<typeof loginSchema>;

/**
 * Схема валідації для оновлення токену
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token обов'язковий"),
});

/**
 * Типи запитів для оновлення токену
 */
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;

/**
 * Ролі користувачів
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

/**
 * Модель користувача
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO для створення користувача
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * DTO для оновлення користувача
 */
export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * DTO для логіну
 */
export interface LoginDto {
  username: string;
  password: string;
}

/**
 * Відповідь на успішну автентифікацію
 */
export interface AuthResponse {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  position?: string;
  accessToken?: string;
  token?: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Стан автентифікації
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Запит для реєстрації
 */
export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  position?: string;
}
