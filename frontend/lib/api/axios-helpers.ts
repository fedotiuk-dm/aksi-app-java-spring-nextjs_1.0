import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth';
import {
  AXIOS_CONFIG,
  CANCELED_ERROR,
  ENABLE_TRANSFORMS,
  IGNORE_401_PATHS,
  NETWORK_ERROR,
  USERS_ME_PATH,
  isSilentPath,
} from './axios-config';
import { ApiError } from './api-error';

export function isUsersMe(url?: string): boolean {
  return !!url && url.includes(USERS_ME_PATH);
}

export function shouldLogDevError(message: string, url?: string): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    !isSilentPath(url) &&
    message !== NETWORK_ERROR &&
    message !== CANCELED_ERROR
  );
}

export function shouldLogDev(url?: string): boolean {
  return process.env.NODE_ENV === 'development' && !isSilentPath(url);
}

export function redirectToLogin(): void {
  const callbackUrl = window.location.pathname + window.location.search;
  window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export function getUsersMeUnauthenticatedError(message: string): ApiError {
  return new ApiError({
    status: 401,
    message,
    path: USERS_ME_PATH,
    method: 'GET',
  });
}

export function maybeHandleUsersMe500(url?: string): ApiError | null {
  if (isUsersMe(url)) {
    // eslint-disable-next-line no-console
    console.log('📌 500 error on /users/me - user might not be authenticated');
    return getUsersMeUnauthenticatedError('Користувач не авторизований');
  }
  return null;
}

export type StatusHandler = (url: string | undefined, apiError: ApiError) => ApiError;

export const statusHandlers: Record<number, StatusHandler> = {
  500: (url, apiError) => maybeHandleUsersMe500(url) ?? apiError,
  401: (url, apiError) => {
    if (IGNORE_401_PATHS.some((path) => url?.includes(path))) return apiError;
    useAuthStore.getState().logout();
    redirectToLogin();
    return apiError;
  },
  403: (url, apiError) => {
    if (!isUsersMe(url)) {
      useAuthStore.getState().logout();
      redirectToLogin();
    }
    return apiError;
  },
  404: (url, apiError) =>
    isUsersMe(url) ? getUsersMeUnauthenticatedError('User not authenticated') : apiError,
};

export function toApiError(error: AxiosError): ApiError {
  return ApiError.fromAxiosError(error);
}

export { AXIOS_CONFIG, ENABLE_TRANSFORMS, isSilentPath };

export async function onAxiosResponseError(error: unknown): Promise<never> {
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  if (!axios.isAxiosError(error)) {
    return Promise.reject(error);
  }

  const axiosError = error as AxiosError;
  const apiError = ApiError.fromAxiosError(axiosError);

  if (typeof window === 'undefined') {
    return Promise.reject(apiError);
  }

  const url = axiosError.config?.url;
  if (shouldLogDevError(axiosError.message, url)) {
    apiError.logToConsole();
  }

  const status = axiosError.response?.status;
  if (status && statusHandlers[status]) {
    const handledError = statusHandlers[status](url, apiError);
    return Promise.reject(handledError);
  }

  return Promise.reject(apiError);
}
