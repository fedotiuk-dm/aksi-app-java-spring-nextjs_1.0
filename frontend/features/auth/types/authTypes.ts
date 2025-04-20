import { UUID } from 'crypto';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  CLIENT = 'CLIENT',
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  id: UUID;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  position?: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  username?: string;
  userId?: string;
  role?: UserRole;
  exp: number;
  iat: number;
}

export interface AuthUser {
  id: UUID;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  position?: string;
  isAuthenticated: boolean;
}

export interface AuthError {
  status?: number;
  message: string;
  code?: string;
}
