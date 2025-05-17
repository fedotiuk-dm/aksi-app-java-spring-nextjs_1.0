import { OpenAPI } from './generated';
import axios, { AxiosError } from 'axios';

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
    console.log('JWT токен додано в заголовок запиту');
  } else {
    console.warn('Не знайдено JWT токен - перевірте авторизацію');
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

// Додаємо перехоплювач відповідей для обробки 403 помилок
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 403) {
      console.error(
        'Помилка авторизації (403). Спробуйте перезавантажити сторінку або заново увійти в систему.'
      );

      // Тут можна додати логіку автоматичного оновлення токена
      // наприклад, запит на '/api/auth/refresh-token'

      // Показуємо повідомлення про помилку
      if (typeof window !== 'undefined') {
        console.log('URL запиту, що викликав 403:', error.config?.url);
      }
    }
    return Promise.reject(error);
  }
);

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

// Додаємо глобальний перехоплювач запитів для виправлення проблем з API
// Цей інтерцептор обробляє всі запити, а не тільки з OpenAPI
axios.interceptors.request.use(
  (config) => {
    // Правило 1: Для /price-calculation/calculate завжди використовуємо POST
    if (config.url?.includes('/price-calculation/calculate')) {
      // Примусово встановлюємо метод POST
      config.method = 'post';

      // Правило 2: Переконуємося, що quantity=1 є в тілі запиту
      if (config.data) {
        // Якщо дані вже є в форматі string (JSON), парсимо і модифікуємо
        if (typeof config.data === 'string') {
          try {
            const parsedData = JSON.parse(config.data);
            if (!parsedData.quantity) {
              parsedData.quantity = 1;
              config.data = JSON.stringify(parsedData);
            }
          } catch (e) {
            // Ігноруємо помилки парсингу
          }
        }
        // Якщо дані у форматі об'єкта, просто додаємо quantity
        else if (typeof config.data === 'object') {
          const data = config.data as any;
          if (!data.quantity) {
            data.quantity = 1;
          }
        }
      }
      // Якщо даних немає, створюємо об'єкт з quantity=1
      else if (!config.data && config.method === 'post') {
        config.data = { quantity: 1 };
      }

      // Правило 3: Переконуємося, що заголовок Content-Type встановлено правильно
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Додатковий перехоплювач для axiosInstance (для OpenAPI)
axiosInstance.interceptors.request.use(
  (config) => {
    // Той самий код для примусового POST і quantity=1
    if (config.url?.includes('/price-calculation/calculate')) {
      config.method = 'post';

      if (config.data && typeof config.data === 'object') {
        const data = config.data as any;
        if (!data.quantity) {
          data.quantity = 1;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Замінюємо глобальний axios на наш налаштований екземпляр
if (typeof window !== 'undefined') {
  // Примітка: це хак, щоб змусити всі OpenAPI клієнти використовувати наш axios
  interface ExtendedWindow extends Window {
    // Використовуємо any, бо це спеціальний хак для OpenAPI клієнтів
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    axios: any;
  }
  (window as unknown as ExtendedWindow).axios = axiosInstance;
}

// Завантажити всі генеровані файли OpenAPI
export * from './generated';
