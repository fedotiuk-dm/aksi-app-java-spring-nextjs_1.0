import type { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Стилі для консольного логування API запитів/відповідей
 */
const LOG_STYLES = {
  request: 'color: #61affe; font-weight: bold;',
  success: 'color: #49cc90; font-weight: bold;',
  error: 'color: #f93e3e; font-weight: bold;',
  info: 'color: #8650e8; font-weight: bold;',
};

/**
 * Опції для логування API
 */
export interface ApiLoggerOptions {
  /** Префікс для логів (наприклад, "OrderWizard") */
  prefix?: string;
  /** Чи логувати запити */
  logRequests?: boolean;
  /** Чи логувати відповіді */
  logResponses?: boolean;
  /** Чи логувати заголовки запитів */
  logRequestHeaders?: boolean;
  /** Чи логувати заголовки відповідей */
  logResponseHeaders?: boolean;
  /** Чи виводити тіло запиту */
  logRequestBody?: boolean;
  /** Чи виводити тіло відповіді */
  logResponseBody?: boolean;
  /** Чи виводити розгорнутий JSON */
  prettyPrint?: boolean;
}

/**
 * Функція для додавання логування до Axios інстансу
 */
export function addApiLogger(axiosInstance: AxiosInstance, options: ApiLoggerOptions = {}): void {
  // Налаштування за замовчуванням
  const {
    prefix = 'API',
    logRequests = true,
    logResponses = true,
    logRequestHeaders = false,
    logResponseHeaders = false,
    logRequestBody = true,
    logResponseBody = true,
    prettyPrint = true,
  } = options;

  // Логуємо запити
  if (logRequests) {
    axiosInstance.interceptors.request.use((config) => {
      const { method, url, data, headers } = config;

      console.group(`%c${prefix} Request: ${method?.toUpperCase()} ${url}`, LOG_STYLES.request);

      if (logRequestBody && data) {
        console.log('Request Body:', prettyPrint ? JSON.stringify(data, null, 2) : data);
      }

      if (logRequestHeaders) {
        console.log('Request Headers:', headers);
      }

      console.log('Full URL:', `${config.baseURL || ''}${url || ''}`);
      console.groupEnd();

      return config;
    });
  }

  // Логуємо відповіді
  if (logResponses) {
    axiosInstance.interceptors.response.use(
      // Успішні відповіді
      (response: AxiosResponse) => {
        const { status, config, data, headers } = response;

        console.group(
          `%c${prefix} Response ${status}: ${config.method?.toUpperCase()} ${config.url}`,
          LOG_STYLES.success
        );

        if (logResponseBody) {
          console.log('Response Data:', prettyPrint ? JSON.stringify(data, null, 2) : data);
        }

        if (logResponseHeaders) {
          console.log('Response Headers:', headers);
        }

        console.groupEnd();

        return response;
      },

      // Помилки
      (error) => {
        if (error.response) {
          const { status, config, data } = error.response;

          console.group(
            `%c${prefix} Error ${status}: ${config.method?.toUpperCase()} ${config.url}`,
            LOG_STYLES.error
          );

          console.log('Error Data:', prettyPrint ? JSON.stringify(data, null, 2) : data);

          if (logResponseHeaders && error.response.headers) {
            console.log('Error Headers:', error.response.headers);
          }
        } else {
          console.group(`%c${prefix} Network Error`, LOG_STYLES.error);
          console.log('Error:', error.message);
        }

        console.groupEnd();

        return Promise.reject(error);
      }
    );
  }
}

/**
 * Функція для створення Axios інстансу з логуванням для OrderWizard API
 */
export function createOrderWizardApiLogger(axiosInstance: AxiosInstance): void {
  addApiLogger(axiosInstance, {
    prefix: 'OrderWizard',
    logRequests: true,
    logResponses: true,
    logRequestHeaders: false,
    logResponseHeaders: false,
    logRequestBody: true,
    logResponseBody: true,
    prettyPrint: true,
  });
}
