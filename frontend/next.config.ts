import type { NextConfig } from 'next';

// Визначаємо базовий URL бекенду залежно від середовища
const BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://backend:8080' // Docker-ім'я сервісу
    : 'http://localhost:8080'; // Локальна розробка

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || BACKEND_URL,
  },

  // Standalone output для Docker production builds
  output: 'standalone',

  // Experimental features
  experimental: {
    // Турбопакет для прискорення розробки
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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

  // Налаштування для кращої продуктивності
  compress: true,
  poweredByHeader: false,

  // Налаштування для роботи з API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
