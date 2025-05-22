import axios, { AxiosError } from 'axios';

import { OpenAPI } from './generated';

import type { AxiosInstance } from 'axios';

/**
 * Фіксоване налаштування для всіх OpenAPI запитів
 * НЕЗАЛЕЖНО від інших налаштувань чи режимів роботи
 */

/**
 * ВАЖЛИВО: Spring Boot має контекстний шлях /api
 * Тому всі безпосередні запити мають йти на `${SERVER_API_URL}/api`
 * Не додавайте /api в шляхах OpenAPI клієнтів, це вже враховано в OpenAPI.BASE
 */

/**
 * НАЛАШТУВАННЯ API ДЛЯ РОБОТИ З TRAEFIK
 *
 * Для клієнтського коду тепер ми використовуємо простий префікс '/api',
 * який автоматично маршрутизується Traefik на бекенд.
 * Це спрощує архітектуру і зменшує кількість потенційних проблем.
 */

// Використовуємо фіксований URL для всіх API запитів - це гарантує, що всі запити йтимуть через Traefik

// Визначення базового URL залежно від режиму роботи
const BASE_API_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost/api' // В продакшн через Traefik
    : 'http://localhost:8080/api'; // Локальна розробка з прямим доступом до бекенду

OpenAPI.BASE = BASE_API_URL; // Використовуємо повний URL до бекенду

// Критично важливі налаштування для авторизації:
OpenAPI.WITH_CREDENTIALS = true; // Дозволяє передавати cookies з токенами
OpenAPI.CREDENTIALS = 'include'; // Дозволяє включати cookies в крос-доменні запити

// Активуємо режим налагодження для OpenAPI запитів
const DEBUG_API = true;

// Кеш для токена авторизації
let cachedToken: string | undefined;
let tokenExpiryTime: number = 0;

// Функція для отримання JWT токена через API роут
const getAuthToken = async (): Promise<string | undefined> => {
  // Якщо ми на сервері, повертаємо undefined
  if (typeof window === 'undefined') return undefined;

  // Якщо у нас є кешований токен і він не прострочений
  const currentTime = Date.now();
  if (cachedToken && currentTime < tokenExpiryTime) {
    return cachedToken;
  }

  try {
    // Отримуємо токен через API роут
    const response = await fetch('/api/auth/token');

    if (!response.ok) {
      console.warn('Помилка при отриманні токена:', response.statusText);
      return undefined;
    }

    const data = await response.json();

    if (data.token) {
      cachedToken = data.token;
      // Зберігаємо токен в кеші на 10 хвилин
      tokenExpiryTime = currentTime + 10 * 60 * 1000; // 10 хвилин
      return data.token;
    }
  } catch (error) {
    console.error('Помилка при отриманні токена:', error);
  }

  return undefined;
};

// Встановлюємо заголовки для всіх запитів OpenAPI
OpenAPI.HEADERS = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Додаємо для CORS
  };

  // Отримуємо токен авторизації через API роут
  const token = await getAuthToken();
  if (token) {
    // Критично важливо: додаємо токен в заголовок Authorization
    headers['Authorization'] = `Bearer ${token}`;
    if (DEBUG_API) console.log('JWT токен додано в заголовок запиту');
  } else {
    if (DEBUG_API) console.warn('Не знайдено JWT токен - перевірте авторизацію');
  }

  return headers;
};

// Налаштовуємо окремий екземпляр axios для всіх запитів OpenAPI
const axiosInstance = axios.create({
  baseURL: OpenAPI.BASE, // Використовуємо CLIENT_API_URL
  withCredentials: true, // Забезпечуємо передачу cookies в усіх запитах
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Додаємо перехоплювач запитів для логування
axiosInstance.interceptors.request.use(
  (config) => {
    if (DEBUG_API) {
      console.log(`🔍 ДІАГНОСТИКА API ЗАПИТУ:`);
      console.log(`- URL: ${config.url}`);
      console.log(`- Метод: ${config.method?.toUpperCase()}`);
      console.log(`- Заголовки:`, config.headers);
      if (config.data) {
        try {
          console.log(
            `- Дані:`,
            typeof config.data === 'string' ? JSON.parse(config.data) : config.data
          );
        } catch (e) {
          console.log(`- Дані:`, config.data);
        }
      }
    }
    return config;
  },
  (error) => {
    if (DEBUG_API) {
      console.error(`❌ Помилка при створенні запиту:`, error);
    }
    return Promise.reject(error);
  }
);

// Додаємо перехоплювач відповідей для логування та обробки помилок
axiosInstance.interceptors.response.use(
  (response) => {
    if (DEBUG_API) {
      console.log(`✅ ДІАГНОСТИКА API ВІДПОВІДІ:`);
      console.log(`- URL: ${response.config.url}`);
      console.log(`- Статус: ${response.status} ${response.statusText}`);
      console.log(`- Заголовки:`, response.headers);
      if (response.data) {
        console.log(`- Дані:`, response.data);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    logApiError(error);
    handleAuthError(error);
    handleBadRequestError(error);
    return Promise.reject(error);
  }
);

// Функція для логування помилок API
const logApiError = (error: AxiosError): void => {
  if (!DEBUG_API) return;

  console.error(`❌ ДІАГНОСТИКА API ПОМИЛКИ:`);
  console.error(`- URL: ${error.config?.url}`);
  console.error(`- Метод: ${error.config?.method?.toUpperCase()}`);

  if (error.response) {
    console.error(`- Статус: ${error.response.status} ${error.response.statusText}`);
    console.error(`- Дані відповіді:`, error.response.data);
  } else {
    console.error(`- Помилка без відповіді:`, error.message);
  }

  console.error(`- Стек:`, error.stack);
};

// Функція для обробки помилок авторизації
const handleAuthError = (error: AxiosError): void => {
  if (!error.response || error.response.status !== 403) return;

  console.error(
    'Помилка авторизації (403). Спробуйте перезавантажити сторінку або заново увійти в систему.'
  );

  // Тут можна додати логіку автоматичного оновлення токена
  // наприклад, запит на '/api/auth/refresh-token'

  if (typeof window !== 'undefined') {
    console.log('URL запиту, що викликав 403:', error.config?.url);
  }
};

// Функція для обробки Bad Request помилок
const handleBadRequestError = (error: AxiosError): void => {
  if (!error.response || error.response.status !== 400) return;

  console.error('Помилка 400 Bad Request - перевірка форматів даних:');

  try {
    const requestData = parseRequestData(error);

    console.error('- Запит:', requestData);
    console.error('- Відповідь:', error.response.data);

    logRequestDataTypes(requestData);
  } catch (e) {
    console.error('- Помилка при аналізі даних запиту:', e);
  }
};

// Парсинг даних запиту
const parseRequestData = (error: AxiosError): any => {
  if (!error.config?.data) return null;

  return typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
};

// Логування типів даних запиту
const logRequestDataTypes = (requestData: any): void => {
  if (!requestData) return;

  console.error('- Типи даних запиту:');
  Object.entries(requestData).forEach(([key, value]) => {
    console.error(`  ${key}: ${typeof value} (${value})`);
  });
};

// Додати axios інтерцептор для обробки помилок
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Перевіряємо, чи це помилка з методом HTTP
    if (error.response && error.response.status === 405) {
      console.error('Помилка HTTP 405: Метод не дозволений', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.response?.data?.message || error.message,
      });
    }

    // Для відлагодження у розробці
    if (process.env.NODE_ENV === 'development') {
      console.error('API запит завершився з помилкою:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// Типи для конфігурації axios
interface AxiosConfig {
  url?: string;
  method?: string;
  data?: unknown;
  headers?: Record<string, string>;
}

interface ExtendedWindow extends Window {
  axios: AxiosInstance;
}

// Функція для обробки даних запиту
const processRequestData = (config: AxiosConfig): void => {
  if (config.data) {
    if (typeof config.data === 'string') {
      try {
        const parsedData = JSON.parse(config.data);
        if (!parsedData.quantity) {
          parsedData.quantity = 1;
          config.data = JSON.stringify(parsedData);
        }
      } catch {
        // Ігноруємо помилки парсингу
      }
    } else if (typeof config.data === 'object') {
      const data = config.data as { quantity?: number };
      if (!data.quantity) {
        data.quantity = 1;
      }
    }
  } else if (!config.data && config.method === 'post') {
    config.data = { quantity: 1 };
  }
};

// Функція для обробки заголовків
const processHeaders = (config: AxiosConfig): void => {
  if (!config.headers) {
    config.headers = {};
  }
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
};

// Додаємо глобальний перехоплювач запитів для виправлення проблем з API
axios.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/price-calculation/calculate')) {
      config.method = 'post';
      processRequestData(config);
      processHeaders(config);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Додатковий перехоплювач для axiosInstance (для OpenAPI)
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/price-calculation/calculate')) {
      config.method = 'post';
      processRequestData(config);
    }

    // Для діагностики проблем з пошуком клієнтів
    if (config.url?.includes('/clients/search')) {
      if (DEBUG_API) {
        console.log(`🔎 ПОШУК КЛІЄНТІВ - ДІАГНОСТИКА:`);
        console.log(`- URL: ${config.url}`);
        console.log(`- Метод: ${config.method?.toUpperCase()}`);

        try {
          const requestData =
            typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          console.log(`- Дані запиту:`, requestData);

          // Перевірка типів даних page і size
          if (requestData) {
            console.log(`- Типи даних у запиті:`);
            Object.entries(requestData).forEach(([key, value]) => {
              console.log(`  ${key}: ${typeof value} (${value})`);
            });
          }
        } catch (e) {
          console.log(`- Помилка при аналізі даних запиту:`, e);
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Замінюємо глобальний axios на наш налаштований екземпляр
if (typeof window !== 'undefined') {
  (window as unknown as ExtendedWindow).axios = axiosInstance;
}

// Інтеграція з OpenAPI
// @ts-ignore
OpenAPI.axios = axiosInstance;

// Завантажити всі генеровані файли OpenAPI
export * from './generated';
