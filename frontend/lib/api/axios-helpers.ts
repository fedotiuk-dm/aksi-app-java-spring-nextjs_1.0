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

// GlitchTip/Sentry import - тільки на клієнті
let Sentry: any = null;
if (typeof window !== 'undefined') {
  try {
    Sentry = require('@sentry/nextjs');
  } catch (error) {
    console.warn('Sentry/GlitchTip не ініціалізований:', error);
  }
}

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

function isAuthError(apiError: ApiError): boolean {
  const message = apiError.message?.toLowerCase() || '';
  return (
    message.includes('unauthorized') ||
    message.includes('access denied') ||
    message.includes('authentication') ||
    message.includes('no session') ||
    message.includes('session expired')
  );
}

export type StatusHandler = (url: string | undefined, apiError: ApiError) => ApiError;

/**
 * Відправляє помилку до GlitchTip/Sentry
 */
function reportToGlitchTip(error: unknown, context?: Record<string, any>): void {
  if (!Sentry || typeof window === 'undefined') return;

  try {
    // Створюємо контекст для помилки
    const errorContext = {
      source: 'axios_error_handler',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context,
    };

    // Додаємо контекст до Sentry
    Sentry.setContext('api_error', errorContext);

    // Відправляємо помилку
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(`API Error: ${String(error)}`, 'error');
    }

    // Очищаємо контекст після відправки
    Sentry.setContext('api_error', undefined);
  } catch (sentryError) {
    console.warn('Помилка при відправці до GlitchTip:', sentryError);
  }
}

export const statusHandlers: Record<number, StatusHandler> = {
  400: (_, apiError) => {
    if (isAuthError(apiError)) {
      useAuthStore.getState().logout();
      redirectToLogin();
    }
    return apiError;
  },
  500: (url, apiError) => {
    const usersMeError = maybeHandleUsersMe500(url);
    if (usersMeError) return usersMeError;

    // Log Access Denied for debugging
    if (apiError.message?.includes('Access Denied')) {
      console.error(`🔒 Access Denied on: ${url || 'unknown URL'}`);
    }

    return apiError;
  },
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

export { AXIOS_CONFIG, ENABLE_TRANSFORMS, isSilentPath };

export async function onAxiosResponseError(error: unknown): Promise<never> {
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  if (!axios.isAxiosError(error)) {
    // Відправляємо не-Axios помилки до GlitchTip
    reportToGlitchTip(error, {
      type: 'non_axios_error',
      error_message: String(error),
    });
    return Promise.reject(error);
  }

  const axiosError = error as AxiosError;
  const apiError = ApiError.fromAxiosError(axiosError);

  if (typeof window === 'undefined') {
    return Promise.reject(apiError);
  }

  const url = axiosError.config?.url;

  // Відправляємо помилку до GlitchTip, якщо це не silent path та не мережева помилка
  if (!isSilentPath(url) && axiosError.message !== NETWORK_ERROR) {
    reportToGlitchTip(axiosError, {
      type: 'api_error',
      url: url,
      method: axiosError.config?.method?.toUpperCase(),
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      responseData: axiosError.response?.data,
      requestData: axiosError.config?.data,
    });
  }

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
