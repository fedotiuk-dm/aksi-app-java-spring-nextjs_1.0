declare module '@sentry/nextjs' {
  export * from '@sentry/react';

  interface SentryConfigOptions {
    authToken?: string;
    org?: string;
    project?: string;
    sentryUrl?: string;
    silent?: boolean;
    widenClientFileUpload?: boolean;
    reactComponentAnnotation?: { enabled: boolean };
    tunnelRoute?: string;
    hideSourceMaps?: boolean;
    disableLogger?: boolean;
    automaticVercelMonitors?: boolean;
  }

  export function withSentryConfig<T>(config: T, options?: SentryConfigOptions): T;
  export function withSentry<T extends (...args: unknown[]) => unknown>(handler: T): T;
}
