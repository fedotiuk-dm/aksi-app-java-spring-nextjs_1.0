/** @type {import('next').NextConfig} */
const nextConfig = {
  // Перенаправлення API-запитів на бекенд
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // URL бекенду для загальних запитів
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*', // URL бекенду для API v1
      },
    ];
  },
  reactStrictMode: true,
  // swcMinify: true, - видалено через помилку в новій версії Next.js
  // Оптимізації для продакшн-збірки
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Пропуск перевірки типів під час збірки
  typescript: {
    // !! УВАГА !!
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
