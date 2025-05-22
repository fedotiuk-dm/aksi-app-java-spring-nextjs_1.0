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
  // Використовуємо Traefik для всієї маршрутизації
  // Замість проксіювання в Next.js
  async rewrites() {
    return [];
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
