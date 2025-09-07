// This file configures the Sentry browser client.
import * as Sentry from '@sentry/nextjs';

const GLITCHTIP_DSN = process.env.NEXT_PUBLIC_GLITCHTIP_DSN;

if (GLITCHTIP_DSN) {
  Sentry.init({
    dsn: GLITCHTIP_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',

    // Environment settings
    environment: process.env.NODE_ENV || 'development',

    // Tunnel for bypassing ad-blockers
    tunnel: '/api/sentry-tunnel',
  });
}
