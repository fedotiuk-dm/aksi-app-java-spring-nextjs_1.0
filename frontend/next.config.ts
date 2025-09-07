import { withSentryConfig } from '@sentry/nextjs';
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

  // Вимкнено proxy - використовуємо прямі запити до бекенду
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${BACKEND_URL}/api/:path*`,
  //     },
  //   ];
  // },

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

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // GlitchTip конфігурація
  org: 'glitchtip',
  project: 'frontend',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/api/sentry-tunnel',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
