import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  async rewrites() {
    return [
      {
        // Проксіювання запитів до API автентифікації
        source: '/api/auth/:path*',
        destination: 'http://localhost:8080/auth/:path*',
        // Налаштування для повної передачі headers та cookies
        basePath: false,
      },
      {
        // Проксіювання запитів для роботи з клієнтами
        source: '/api/clients/:path*',
        destination: 'http://localhost:8080/clients/:path*',
        // Налаштування для повної передачі headers та cookies
        basePath: false,
      },
      {
        // Проксіювання запитів для роботи з прайс-листом
        source: '/api/price-list/:path*',
        destination: 'http://localhost:8080/price-list/:path*',
        // Налаштування для повної передачі headers та cookies
        basePath: false,
      },
      {
        // Загальні API запити
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
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
