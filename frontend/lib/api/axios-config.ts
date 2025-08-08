export const AXIOS_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 30000),
  silentPaths: ['/users/me', '/api/auth/session', '/test-headers', '/api/users', '/api/auth/login'],
  silentErrors: ['Network Error', 'timeout', 'ECONNABORTED', 'canceled'],
};

export const ENABLE_TRANSFORMS = process.env.NEXT_PUBLIC_API_TRANSFORMS === '1';

export const NETWORK_ERROR = 'Network Error';
export const CANCELED_ERROR = 'canceled';
export const USERS_ME_PATH = '/users/me';
export const IGNORE_401_PATHS = ['/auth/logout', '/auth/session', USERS_ME_PATH, '/auth/login'];

export function isSilentPath(url?: string): boolean {
  if (!url) return false;
  return AXIOS_CONFIG.silentPaths.some((path) => url.includes(path));
}
