import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  },
  async rewrites() {
    return [
      {
        // Проксіювання запитів до API для уникнення CORS
        source: '/api/:path*',
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
        }/:path*`,
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
