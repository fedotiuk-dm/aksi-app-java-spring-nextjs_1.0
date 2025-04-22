import { OpenAPI } from './generated';
import axios, { AxiosError } from 'axios';
import { CLIENT_API_URL } from '@/constants/urls';

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
 * УВАГА! Важлива зміна для клієнтського коду
 * Для клієнтського коду використовуємо CLIENT_API_URL ('/api'), а не прямий запит до бекенду
 * Це забезпечує проксіювання запитів через Next.js API роути
 */

// Всі запити з браузера йдуть на CLIENT_API_URL = '/api' (без є базового URL)
OpenAPI.BASE = CLIENT_API_URL;

// ДВІ КРИТИЧНО ВАЖЛИВІ НАЛАШТУВАННЯ ДЛЯ АВТОРИЗАЦІЇ:
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
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Додаємо для CORS
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
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Додаємо перехоплювач відповідей для обробки 403 помилок
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 403) {
      console.error('Помилка авторизації (403). Спробуйте перезавантажити сторінку або заново увійти в систему.');
      
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

// Замінюємо глобальний axios на наш налаштований екземпляр
if (typeof window !== 'undefined') {
  // Примітка: це хак, щоб змусити всі OpenAPI клієнти використовувати наш axios
  interface ExtendedWindow extends Window {
    // Використовуємо any, бо це спеціальний хак для OpenAPI клієнтів
    axios: any;
  }
  (window as unknown as ExtendedWindow).axios = axiosInstance;
}

// Завантажити всі генеровані файли OpenAPI
export * from './generated';
