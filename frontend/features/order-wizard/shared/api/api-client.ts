'use client';

import axios from 'axios';

import { OpenAPI } from '@/lib/api';
import { HealthCheckControllerService } from '@/lib/api';

import { createOrderWizardApiLogger } from './logger';

// Константи для логування
const LOG_STYLES = {
  title: 'color: #8650e8; font-weight: bold;',
  success: 'color: #49cc90; font-weight: bold;',
  error: 'color: #f93e3e; font-weight: bold;',
};

// Базовий URL для API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Налаштований Axios інстанс для взаємодії з API
 * З інтегрованим логуванням запитів/відповідей
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Налаштування таймаутів
  timeout: 15000,
  // Передача кук для автентифікації
  withCredentials: true,
});

// Додаємо логування API запитів/відповідей
createOrderWizardApiLogger(apiClient);

// Додаємо обробку помилок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обробка помилки автентифікації
    if (error.response && error.response.status === 401) {
      console.error('Помилка автентифікації. Потрібен перенаправлення на сторінку входу.');
      // При необхідності можна додати перенаправлення на сторінку входу
    }

    // Обробка інших помилок
    console.error(`Помилка API (${error.response?.status || 'Network Error'}):`, error.message);

    // Продовжуємо ланцюжок обробки помилок
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Детальне логування конфігурації OpenAPI
 */
export function logOpenApiConfig() {
  console.group(`%cOrderWizard OpenAPI Config`, LOG_STYLES.title);
  console.log('BASE URL:', OpenAPI.BASE);
  console.log('VERSION:', OpenAPI.VERSION);
  console.log('WITH_CREDENTIALS:', OpenAPI.WITH_CREDENTIALS);
  console.log('CREDENTIALS:', OpenAPI.CREDENTIALS);
  console.log(
    'HEADERS:',
    typeof OpenAPI.HEADERS === 'function' ? 'function() {...}' : OpenAPI.HEADERS
  );
  console.groupEnd();
}

/**
 * Отримати додаткову інформацію про API ендпоінт для логування
 */
export function getApiInfo(): { baseUrl: string; withCredentials: boolean } {
  return {
    baseUrl: OpenAPI.BASE,
    withCredentials: OpenAPI.WITH_CREDENTIALS,
  };
}

/**
 * Ініціалізація API клієнта для OrderWizard
 * @returns API клієнт налаштований для роботи з OrderWizard
 */
export function initOrderWizardApi() {
  console.log(`%cOrderWizard API initialized`, LOG_STYLES.title);

  // Логуємо поточні налаштування OpenAPI
  logOpenApiConfig();

  return {
    axios: apiClient,
    baseUrl: OpenAPI.BASE,
  };
}

/**
 * Тестовий метод для перевірки API з'єднання
 * Корисно для діагностики проблем
 */
export async function testApiConnection() {
  try {
    console.group(`%cOrderWizard API Connection Test`, LOG_STYLES.title);
    console.log('Testing connection to:', OpenAPI.BASE);

    // Використовуємо health check ендпоінт для перевірки статусу API
    const response = await HealthCheckControllerService.healthCheck();
    console.log(
      'Connection successful! API health status:',
      response ? 'API is working' : 'API available'
    );

    console.groupEnd();
    return true;
  } catch (error) {
    console.group(`%cOrderWizard API Connection Error`, LOG_STYLES.error);
    console.error('Connection failed:', error);
    console.groupEnd();
    return false;
  }
}
