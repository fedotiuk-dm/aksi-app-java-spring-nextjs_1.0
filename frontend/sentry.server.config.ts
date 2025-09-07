import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.GLITCHTIP_DSN || 'http://6bff08d5d43f4d0a8ffb413c1b60cc89@localhost:8001/2',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',

  enabled: process.env.NODE_ENV === 'production' || process.env.GLITCHTIP_ENABLED === 'true',
});
