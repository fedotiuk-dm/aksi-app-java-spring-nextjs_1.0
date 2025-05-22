/**
 * Інтерфейс для відповіді автентифікації з API
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  position?: string;
}

/**
 * Інтерфейс для даних користувача
 */
export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  position?: string;
}

/**
 * Ролі користувача
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

/**
 * Інтерфейс для помилок автентифікації
 */
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Тип JWT Payload
 */
export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  role: UserRole;
  name: string;
  email: string;
}

/**
 * Конвертує AuthResponse від API в AuthUser для внутрішнього використання
 */
export const convertToAuthUser = (response: AuthResponse): AuthUser => {
  if (!response.id || !response.username || !response.name || !response.email || !response.role) {
    throw new Error('Отримано неповні дані користувача від сервера');
  }

  return {
    id: response.id,
    username: response.username,
    name: response.name,
    email: response.email,
    role: response.role as unknown as UserRole,
    position: response.position ?? undefined,
  };
};
