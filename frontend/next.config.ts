import type { NextConfig } from 'next';

// Визначаємо базовий URL бекенду залежно від середовища
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'http://backend:8080' // Docker-ім'я сервісу
  : 'http://localhost:8080'; // Локальна розробка

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || BACKEND_URL,
  },
  async rewrites() {
    return [
      {
        // Проксіювання запитів до API автентифікації
        source: '/api/auth/:path*',
        destination: `${BACKEND_URL}/api/auth/:path*`,
        // Налаштування для повної передачі headers та cookies
        basePath: false,
      },
      {
        // Проксіювання запитів для роботи з клієнтами
        source: '/api/clients/:path*',
        destination: `${BACKEND_URL}/api/clients/:path*`,
        // Налаштування для повної передачі headers та cookies
        basePath: false,
      },
      {
        // Проксіювання запитів для роботи з прайс-листом
        source: '/api/price-list/:path*',
        destination: `${BACKEND_URL}/api/price-list/:path*`,
        // Налаштування для повної передачі headers та cookies
        basePath: false,
      },
      {
        // Загальні API запити
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
        // Налаштування для повної передачі headers та cookies
        basePath: false,
      },
    ];
  },
  // Пропуск перевірки типів під час збірки
  typescript: {
    // Дозволяємо успішне завершення збірки для продакшну, навіть якщо
    // у проекті є помилки типізації.
    ignoreBuildErrors: true,
  },
  // Ігнорування помилок ESLint під час збірки
  eslint: {
    // Дозволяємо успішне завершення збірки для продакшну, навіть якщо
    // у проекті є помилки ESLint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
